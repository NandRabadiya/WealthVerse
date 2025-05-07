package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.DTO.CategoryApplyRequest;
import com.example.wealthverse.DTO.TransactionDTO;
import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Repository.CategoryRepository;
import com.example.wealthverse.Service.TransactionService;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Repository.TransactionRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.JWTService;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionServiceImpl.class);
    private static final int BATCH_SIZE = 500;

    private final TransactionRepository transactionRepository;
    private final MerchantCategoryMappingRepository mappingRepository;
    private final UserRepository userRepository;
    private final JWTService jwtService;

    @Autowired
    private final CategoryRepository categoryRepository;

    @Autowired
    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            MerchantCategoryMappingRepository mappingRepository,
            UserRepository userRepository,
            JWTService jwtService,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.categoryRepository = categoryRepository;
    }



    @Override
    @Transactional
    public void importFromCsv(MultipartFile csvFile, String authHeader) throws IOException, CsvException {
        if (csvFile == null || csvFile.isEmpty()) {
            throw new IllegalArgumentException("CSV file cannot be empty");
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header");
        }

        // Extract user from JWT
        User user = extractUserFromToken(authHeader);
        logger.info("Importing transactions for user ID: {}", user.getId());

        List<Transaction> transactions = parseTransactionsFromCsv(csvFile, user);
        saveBatchTransactions(transactions);

        logger.info("Successfully imported {} transactions for user ID: {}", transactions.size(), user.getId());
    }

    private User extractUserFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);

        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID " + userId));
    }

    private List<Transaction> parseTransactionsFromCsv(MultipartFile csvFile, User user) throws IOException, CsvException {
        List<Transaction> transactions = new ArrayList<>();

        try (Reader reader = new InputStreamReader(csvFile.getInputStream());
             CSVReader csvReader = new CSVReaderBuilder(reader).withSkipLines(1).build()) {

            String[] row;
            int rowNum = 1; // Account for header row

            while ((row = csvReader.readNext()) != null) {
                rowNum++;
                try {
                    if (row.length < 6) {
                        logger.warn("Skipping row {} - insufficient columns", rowNum);
                        continue;
                    }

                    Transaction transaction = createTransactionFromRow(row, user, rowNum);
                    if (transaction != null) {
                        transactions.add(transaction);
                    }
                } catch (Exception e) {
                    logger.error("Error processing row {}: {}", rowNum, e.getMessage());
                    // Continue processing remaining rows
                }
            }
        }

        return transactions;
    }

    private Transaction createTransactionFromRow(String[] row, User user, int rowNum) {
        try {
            // Parse CSV columns: amount,paymentMode,merchantId,merchantName,transactionType,createdAt
            BigDecimal amount = new BigDecimal(row[0].trim());
            PaymentMode paymentMode = PaymentMode.valueOf(row[1].trim().toUpperCase());
            String merchantId = row[2].trim();
            String merchantName = row[3].trim();
            TransactionType transactionType = TransactionType.valueOf(row[4].trim().toUpperCase());
            LocalDateTime createdAt = LocalDateTime.parse(row[5].trim());

            long userId=user.getId();
            // Lookup global category mapping
//            Optional<MerchantCategoryMapping> mappingOpt = mappingRepository
//                    .findByMerchantNameAndIsGlobalMappingTrue(merchantName);

            // 2. Lookup category mapping
            MerchantCategoryMapping mappingOpt = mappingRepository
                    .findBestMapping(merchantName, userId)
                    .orElseThrow(() -> new IllegalStateException("No mapping found, even for 'MISCELLANEOUS'"));


//            if (mappingOpt.isEmpty()) {
//                logger.warn("No global mapping for merchant: {} at row {}", merchantName, rowNum);
//                throw new IllegalStateException("No global mapping for merchant: " + merchantName);
//            }

            // Build transaction entity
            Transaction transaction = new Transaction();
            transaction.setAmount(amount);
            transaction.setPaymentMode(paymentMode);
            transaction.setMerchantId(merchantId);
            transaction.setMerchantName(merchantName);
            transaction.setTransactionType(transactionType);
            transaction.setCreatedAt(createdAt);
            transaction.setUser(user);
            transaction.setCategory(mappingOpt.getCategory());
            transaction.setCarbonEmission(BigDecimal.ZERO); // Default value, consider calculating this

            return transaction;
        } catch (NumberFormatException e) {
            logger.error("Invalid number format at row {}: {}", rowNum, e.getMessage());
            throw new IllegalArgumentException("Invalid number format at row " + rowNum + ": " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid enum value at row {}: {}", rowNum, e.getMessage());
            throw new IllegalArgumentException("Invalid value at row " + rowNum + ": " + e.getMessage());
        } catch (DateTimeParseException e) {
            logger.error("Invalid date format at row {}: {}", rowNum, e.getMessage());
            throw new IllegalArgumentException("Invalid date format at row " + rowNum + ": " + e.getMessage());
        }
    }

    private void saveBatchTransactions(List<Transaction> transactions) {
        if (transactions.isEmpty()) {
            return;
        }

        // Save in batches to optimize performance for large files
        for (int i = 0; i < transactions.size(); i += BATCH_SIZE) {
            int endIndex = Math.min(i + BATCH_SIZE, transactions.size());
            List<Transaction> batch = transactions.subList(i, endIndex);
            transactionRepository.saveAll(batch);
            logger.debug("Saved batch of {} transactions", batch.size());
        }
    }

    @Override
    @Transactional
    public void addTransaction(AddTransactionRequest request, String authHeader) {
        // 1. Extract user
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 2. Lookup category mapping
        MerchantCategoryMapping mapping = mappingRepository
                .findBestMapping(request.getMerchantName(), userId)
                .orElseThrow(() -> new IllegalStateException("No mapping found, even for 'MISCELLANEOUS'"));


        // 3. Build and save entity
        Transaction tx = new Transaction();
        tx.setAmount(request.getAmount());
        tx.setPaymentMode(request.getPaymentMode());
        tx.setMerchantId(request.getMerchantId());
        tx.setMerchantName(request.getMerchantName().toUpperCase());
        tx.setTransactionType(request.getTransactionType());
        tx.setCreatedAt(request.getCreatedAt() != null ?
                request.getCreatedAt() : LocalDateTime.now());
        tx.setUser(user);
        tx.setCategory(mapping.getCategory());
        tx.setCarbonEmission(BigDecimal.ZERO);


        try {
            transactionRepository.save(tx);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to save transaction", e);
        }

    }


    @Override
    @Transactional(readOnly = true)
    public Page<TransactionDTO> getAllTransactions(String authHeader, int page, int size) {
        // 1. Extract userId from JWT
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);

        // 2. Build pageable: sort by createdAt desc
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // 3. Query repository
        Page<Transaction> txPage = transactionRepository.findAllByUserId(userId, pageable);

        // 4. Map to DTO
        return txPage.map(tx -> {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(tx.getId());
            dto.setAmount(tx.getAmount());
            dto.setPaymentMode(tx.getPaymentMode());
            dto.setMerchantId(tx.getMerchantId());
            dto.setMerchantName(tx.getMerchantName());
            dto.setTransactionType(tx.getTransactionType());
            dto.setUserId(tx.getUser().getId());
            dto.setCategoryId(tx.getCategory().getId());
            dto.setCarbonEmitted(tx.getCarbonEmission());
            dto.setCreatedAt(tx.getCreatedAt());

            return dto;
        });

    }

    @Transactional
    @Override
    public void overrideTransactionCategory(CategoryApplyRequest req, String authHeader) {
        // Extract user
        Long userId = jwtService.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Fetch and verify transaction
        Transaction txn = transactionRepository.findById(req.getTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
        if (!txn.getUser().getId().equals(userId) ||
                !txn.getMerchantName().equalsIgnoreCase(req.getMerchantName())) {
            throw new IllegalArgumentException("Unauthorized or merchant mismatch");
        }

        // Find or create category
        Category cat = categoryRepository
                .findByNameAndUserId(req.getNewCategoryName(), userId)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(req.getNewCategoryName());
                    c.setUser(user);
                    c.setGlobal(false);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setEmissionFactor(BigDecimal.ZERO);
                    return categoryRepository.save(c);
                });

        // Override only this transaction
        txn.setCategory(cat);
        transactionRepository.save(txn);
    }

    @Override
    @Transactional
    public void applyCategoryToAllTransactions(CategoryApplyRequest req, String authHeader) {
        // Extract user
        Long userId = jwtService.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find or create category
        Category cat = categoryRepository
                .findByNameAndUserId(req.getNewCategoryName(), userId)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(req.getNewCategoryName());
                    c.setUser(user);
                    c.setGlobal(false);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setEmissionFactor(BigDecimal.ZERO);
                    return categoryRepository.save(c);
                });

        // Create a user‑specific mapping for future transactions
        // 3. Create a user‑specific mapping for future transactions
        MerchantCategoryMapping mapping = new MerchantCategoryMapping();
        mapping.setMerchantName(req.getMerchantName());
        mapping.setGlobalMapping(false);
        mapping.setUser(user);
        mapping.setCategory(cat);
        mapping.setCreatedAt(LocalDateTime.now());
        mappingRepository.save(mapping);


        // Bulk‑update existing transactions
        int updatedCount = transactionRepository.bulkUpdateCategory(
                cat, userId, req.getMerchantName()
        );
        // (optionally log updatedCount)
    }

}