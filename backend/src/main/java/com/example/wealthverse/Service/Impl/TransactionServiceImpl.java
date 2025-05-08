package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.DTO.CategoryApplyRequest;
import com.example.wealthverse.DTO.TransactionDTO;
import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.CategoryRepository;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Repository.TransactionRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.JWTService;
import com.example.wealthverse.Service.TransactionService;
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

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    private BigDecimal calculateCarbonEmission(Transaction transaction, boolean globalMapping) {
        if (transaction.getTransactionType() == TransactionType.DEBIT && globalMapping) {
            BigDecimal emissionFactor = transaction.getCategory().getEmissionFactor();
            BigDecimal amount = transaction.getAmount();
            BigDecimal emission = amount.multiply(emissionFactor);
           return emission;
        } else {

            return BigDecimal.ZERO;
        }
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
            int rowNum = 1;

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
                }
            }
        }

        return transactions;
    }

    private Transaction createTransactionFromRow(String[] row, User user, int rowNum) {
        try {
            BigDecimal amount = new BigDecimal(row[0].trim());
            PaymentMode paymentMode = PaymentMode.valueOf(row[1].trim().toUpperCase());
            String merchantId = row[2].trim();
            String merchantName = row[3].trim();
            TransactionType transactionType = TransactionType.valueOf(row[4].trim().toUpperCase());
            LocalDateTime createdAt = LocalDateTime.parse(row[5].trim());

            if (merchantId.isEmpty() || merchantName.isEmpty()) {
                logger.warn("Skipping row {} - merchant ID or name is null/empty", rowNum);
                return null;
            }

            MerchantCategoryMapping mapping;
            Transaction transaction = new Transaction();

            Optional<MerchantCategoryMapping> mappingOpt=
                    mappingRepository
                    .findBestMapping(merchantName.toUpperCase(), user.getId());

            Category category = categoryRepository.findById(16L)
                    .orElseThrow(() -> new IllegalArgumentException("Categiory not found with ID "));
            boolean gloablmapping=false;
            if(mappingOpt.isPresent()) {
                mapping = mappingOpt.get();
                category = mapping.getCategory();
                gloablmapping=mapping.isGlobalMapping();
            }

            transaction.setAmount(amount);
            transaction.setPaymentMode(paymentMode);
            transaction.setMerchantId(merchantId);
            transaction.setMerchantName(merchantName.toUpperCase());
            transaction.setTransactionType(transactionType);
            transaction.setCreatedAt(createdAt);
            transaction.setUser(user);
            transaction.setCategory(category);
            transaction.setGloballyMapped(gloablmapping);


            BigDecimal emission =calculateCarbonEmission(transaction,gloablmapping);

            transaction.setCarbonEmission(emission);

            return transaction;
        } catch (Exception e) {
            logger.error("Error parsing row {}: {}", rowNum, e.getMessage());
            return null;
        }
    }

    private void saveBatchTransactions(List<Transaction> transactions) {
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
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
//
//        MerchantCategoryMapping mapping = mappingRepository
//                .findBestMapping(request.getMerchantName(), userId)
//                .orElseThrow(() -> new IllegalStateException("No mapping found, even for 'MISCELLANEOUS'"));

        Transaction tx = new Transaction();
        tx.setAmount(request.getAmount());
        tx.setPaymentMode(request.getPaymentMode());
        tx.setMerchantId(request.getMerchantId());
        tx.setMerchantName(request.getMerchantName().toUpperCase());
        tx.setTransactionType(request.getTransactionType());
        tx.setCreatedAt(request.getCreatedAt() != null ? request.getCreatedAt() : LocalDateTime.now());
        tx.setUser(user);

        Optional<MerchantCategoryMapping> mappingOpt=
                mappingRepository
                        .findBestMapping(request.getMerchantName().toUpperCase(), user.getId());
        MerchantCategoryMapping mapping;

        Category category = categoryRepository.findById(16L)
                .orElseThrow(() -> new IllegalArgumentException("Categiory not found with ID "));
        boolean gloablmapping=false;
        if(mappingOpt.isPresent()) {
            mapping = mappingOpt.get();
            category = mapping.getCategory();
            gloablmapping=mapping.isGlobalMapping();
        }

        tx.setCategory(category);
        tx.setGloballyMapped(gloablmapping);

        BigDecimal emission =calculateCarbonEmission(tx,gloablmapping);

        tx.setCarbonEmission(emission);

        transactionRepository.save(tx);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionDTO> getAllTransactions(String authHeader, int page, int size) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Transaction> txPage = transactionRepository.findAllByUserId(userId, pageable);

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
            dto.setCategoryName(tx.getCategory().getName());
            dto.setCarbonEmitted(tx.getCarbonEmission());
            dto.setCreatedAt(tx.getCreatedAt());
       //     dto.setGlobal(tx.isGloballyMapped());
            return dto;
        });

    }

    // Helper method to map Transaction to TransactionDTO
    private TransactionDTO mapToDTO(Transaction tx) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(tx.getId());
        dto.setAmount(tx.getAmount());
        dto.setPaymentMode(tx.getPaymentMode());
        dto.setMerchantId(tx.getMerchantId());
        dto.setMerchantName(tx.getMerchantName());
        dto.setTransactionType(tx.getTransactionType());
        dto.setUserId(tx.getUser().getId());
        dto.setCategoryId(tx.getCategory().getId());
        dto.setCategoryName(tx.getCategory().getName());
        dto.setCarbonEmitted(tx.getCarbonEmission());
        dto.setCreatedAt(tx.getCreatedAt());
        dto.setGlobal(true);
        return dto;
    }
    @Transactional
    @Override
    public void overrideTransactionCategory(CategoryApplyRequest req, String authHeader) {
        Transaction txn = transactionRepository.findById(req.getTransactionId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));


        Category cat = categoryRepository
                .findByName(req.getNewCategoryName().toUpperCase())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        txn.setCategory(cat);

        txn.setGloballyMapped(false);
        txn.setCarbonEmission(BigDecimal.ZERO);

        transactionRepository.save(txn);
    }

    @Override
    @Transactional
    public void applyCategoryToAllTransactions(CategoryApplyRequest req, String authHeader) {
        Long userId = jwtService.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Category cat = categoryRepository
                .findByNameAndUserId(req.getNewCategoryName(), userId)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(req.getNewCategoryName());
                    c.setUser(user);
                    c.setGlobal(true);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setEmissionFactor(BigDecimal.ZERO);
                    return categoryRepository.save(c);
                });

        MerchantCategoryMapping mapping = new MerchantCategoryMapping();
        mapping.setMerchantName(req.getMerchantName());
        mapping.setGlobalMapping(true);
        mapping.setUser(user);
        mapping.setCategory(cat);
        mapping.setCreatedAt(LocalDateTime.now());
        mappingRepository.save(mapping);

        int updatedCount = transactionRepository.bulkUpdateCategory(
                cat, userId, req.getMerchantName()
        );

        List<Transaction> transactions = transactionRepository.findByUserIdAndMerchantNameAndTransactionType(
                userId, req.getMerchantName(), TransactionType.DEBIT);

        for (Transaction tx : transactions) {
            tx.setCarbonEmission(BigDecimal.ZERO);
            tx.setGloballyMapped(false);
        }

        transactionRepository.saveAll(transactions);
        logger.info("Updated {} transactions with new category '{}'", updatedCount, req.getNewCategoryName());
    }
}
