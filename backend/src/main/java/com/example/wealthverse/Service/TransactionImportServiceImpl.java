package com.example.wealthverse.Service;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Interface.TransactionImportService;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Repository.TransactionRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionImportServiceImpl implements TransactionImportService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionImportServiceImpl.class);
    private static final int BATCH_SIZE = 500;

    private final TransactionRepository transactionRepository;
    private final MerchantCategoryMappingRepository mappingRepository;
    private final UserRepository userRepository;
    private final JWTService jwtService;

    @Autowired
    public TransactionImportServiceImpl(
            TransactionRepository transactionRepository,
            MerchantCategoryMappingRepository mappingRepository,
            UserRepository userRepository,
            JWTService jwtService) {
        this.transactionRepository = transactionRepository;
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
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

            // Lookup global category mapping
            Optional<MerchantCategoryMapping> mappingOpt = mappingRepository
                    .findByMerchantNameAndIsGlobalMappingTrue(merchantName);

            if (mappingOpt.isEmpty()) {
                logger.warn("No global mapping for merchant: {} at row {}", merchantName, rowNum);
                throw new IllegalStateException("No global mapping for merchant: " + merchantName);
            }

            // Build transaction entity
            Transaction transaction = new Transaction();
            transaction.setAmount(amount);
            transaction.setPaymentMode(paymentMode);
            transaction.setMerchantId(merchantId);
            transaction.setMerchantName(merchantName);
            transaction.setTransactionType(transactionType);
            transaction.setCreatedAt(createdAt);
            transaction.setUser(user);
            transaction.setCategory(mappingOpt.get().getCategory());
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
}