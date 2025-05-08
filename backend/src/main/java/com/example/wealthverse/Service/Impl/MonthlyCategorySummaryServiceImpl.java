package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.Model.MonthlyCategorySummary;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Repository.MonthlyCategorySummaryRepository;
import com.example.wealthverse.Repository.TransactionRepository;
import com.example.wealthverse.Service.MonthlyCategorySummaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MonthlyCategorySummaryServiceImpl implements MonthlyCategorySummaryService {
    private static final Logger logger = LoggerFactory.getLogger(MonthlyCategorySummaryServiceImpl.class);
    private static final int BATCH_SIZE = 500;

    private final MonthlyCategorySummaryRepository summaryRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public MonthlyCategorySummaryServiceImpl(
            MonthlyCategorySummaryRepository summaryRepository,
            TransactionRepository transactionRepository) {
        this.summaryRepository = summaryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<MonthlyCategorySummary> getUserMonthlySummary(Long userId, YearMonth yearMonth) {
        logger.debug("Retrieving monthly summary for user {} for {}", userId, yearMonth);
        LocalDateTime now = LocalDateTime.now();

        List<MonthlyCategorySummary> existingSummaries = summaryRepository.findByUserIdAndYearMonth(userId, yearMonth);

        // If no summaries exist, use start of month as aggregation time
        LocalDateTime oldestAggregationTime = existingSummaries.isEmpty()
                ? yearMonth.atDay(1).atStartOfDay()
                : existingSummaries.stream()
                .map(MonthlyCategorySummary::getLastAggregatedAt)
                .filter(Objects::nonNull)
                .min(LocalDateTime::compareTo)
                .orElse(yearMonth.atDay(1).atStartOfDay());

        logger.debug("Processing transactions since {}", oldestAggregationTime);

        return processTransactionsInBatches(userId, yearMonth, existingSummaries, oldestAggregationTime, now);
    }

    private List<MonthlyCategorySummary> processTransactionsInBatches(
            Long userId,
            YearMonth yearMonth,
            List<MonthlyCategorySummary> existingSummaries,
            LocalDateTime oldestAggregationTime,
            LocalDateTime updatedAt) {

        // Convert list to map for efficient lookup
        Map<Long, MonthlyCategorySummary> summaryByCategory = existingSummaries.stream()
                .collect(Collectors.toMap(
                        MonthlyCategorySummary::getCategoryId,
                        Function.identity(),
                        (existing, replacement) -> existing // Handle potential duplicates
                ));

        Map<Long, TransactionAggregates> aggregatesByCategory = new ConcurrentHashMap<>();

        // Use parallel processing for both transaction types
        CompletableFuture<Void> regularTransactionsFuture = CompletableFuture.runAsync(() ->
                processRegularTransactions(userId, yearMonth, oldestAggregationTime, aggregatesByCategory)
        );

        CompletableFuture<Void> globalMappedTransactionsFuture = CompletableFuture.runAsync(() ->
                processGlobalMappedTransactions(userId, yearMonth, oldestAggregationTime, aggregatesByCategory)
        );

        // Wait for both processes to complete
        try {
            CompletableFuture.allOf(regularTransactionsFuture, globalMappedTransactionsFuture).join();
        } catch (Exception e) {
            logger.error("Error processing transactions in parallel: {}", e.getMessage(), e);
            // Consider adding more error handling or fallback logic here
        }

        // If no new transactions, return existing summaries as is
        if (aggregatesByCategory.isEmpty()) {
            return existingSummaries;
        }

        // Prepare summaries for batch save with optimized handling
        List<MonthlyCategorySummary> summariesToSave = new ArrayList<>(aggregatesByCategory.size());

        for (Map.Entry<Long, TransactionAggregates> entry : aggregatesByCategory.entrySet()) {
            Long categoryId = entry.getKey();
            TransactionAggregates aggregates = entry.getValue();

            MonthlyCategorySummary summary = summaryByCategory.get(categoryId);

            if (summary == null) {
                // Create new summary for categories we haven't seen before
                summary = new MonthlyCategorySummary(
                        userId,
                        yearMonth,
                        categoryId,
                        aggregates.getTotalAmount(),
                        aggregates.getTotalEmission(),
                        updatedAt
                );
            } else {
                // Update existing summary with new aggregates
                BigDecimal newAmount = summary.getTotalAmount() != null
                        ? summary.getTotalAmount().add(aggregates.getTotalAmount())
                        : aggregates.getTotalAmount();
                summary.setTotalAmount(newAmount);

                BigDecimal newEmission = summary.getTotalEmission() != null
                        ? summary.getTotalEmission().add(aggregates.getTotalEmission())
                        : aggregates.getTotalEmission();
                summary.setTotalEmission(newEmission);
                summary.setLastAggregatedAt(updatedAt);
            }

            summariesToSave.add(summary);
            summaryByCategory.put(categoryId, summary);
        }

        // Batch save all summaries
        try {
            if (!summariesToSave.isEmpty()) {
                summaryRepository.saveAll(summariesToSave);
                logger.debug("Saved {} updated monthly summaries", summariesToSave.size());
            }
        } catch (Exception e) {
            logger.error("Error saving summaries: {}", e.getMessage(), e);
            // Consider adding transaction retry or rollback logic here
        }

        return new ArrayList<>(summaryByCategory.values());
    }

    private void processRegularTransactions(
            Long userId,
            YearMonth yearMonth,
            LocalDateTime oldestAggregationTime,
            Map<Long, TransactionAggregates> aggregatesByCategory) {

        int pageNumber = 0;
        boolean hasMoreData = true;

        while (hasMoreData) {
            Pageable pageable = PageRequest.of(pageNumber, BATCH_SIZE);

            try {
                Page<Transaction> transactionPage = transactionRepository.findTransactionsSincePaged(
                        userId, yearMonth, oldestAggregationTime, pageable);

                List<Transaction> transactions = transactionPage.getContent();

                if (transactions.isEmpty()) {
                    hasMoreData = false;
                    continue;
                }

                // Process transactions in parallel with improved null safety
                transactions.parallelStream().forEach(transaction -> {
                    if (transaction.getCategory() == null || transaction.getCategory().getId() == null) {
                        logger.warn("Transaction {} has null category or categoryId, skipping", transaction.getId());
                        return;
                    }

                    Long categoryId = transaction.getCategory().getId();

                    aggregatesByCategory.compute(categoryId, (key, aggregates) -> {
                        if (aggregates == null) {
                            aggregates = new TransactionAggregates();
                        }
                        aggregates.addAmount(transaction.getAmount());
                        return aggregates;
                    });
                });

                hasMoreData = !transactionPage.isLast();
                pageNumber++;

                logger.debug("Processed regular transactions batch {} with {} transactions", pageNumber, transactions.size());
            } catch (Exception e) {
                logger.error("Error processing regular transactions batch {}: {}", pageNumber, e.getMessage(), e);
                hasMoreData = false;
            }
        }
    }

    private void processGlobalMappedTransactions(
            Long userId,
            YearMonth yearMonth,
            LocalDateTime oldestAggregationTime,
            Map<Long, TransactionAggregates> aggregatesByCategory) {

        int pageNumber = 0;
        boolean hasMoreData = true;

        while (hasMoreData) {
            Pageable pageable = PageRequest.of(pageNumber, BATCH_SIZE);

            try {
                // Using the repository method with year/month parameters
                Page<Transaction> transactionPage = transactionRepository.findGlobalMappedTransactionsSincePaged(
                        userId,
                        yearMonth.getYear(),
                        yearMonth.getMonthValue(),
                        oldestAggregationTime,
                        pageable);

                List<Transaction> transactions = transactionPage.getContent();

                if (transactions.isEmpty()) {
                    hasMoreData = false;
                    continue;
                }

                // Process transactions in parallel with improved null safety
                transactions.parallelStream().forEach(transaction -> {
                    if (transaction.getCategory() == null || transaction.getCategory().getId() == null) {
                        logger.warn("Global mapped transaction {} has null category or categoryId, skipping", transaction.getId());
                        return;
                    }

                    Long categoryId = transaction.getCategory().getId();

                    aggregatesByCategory.compute(categoryId, (key, aggregates) -> {
                        if (aggregates == null) {
                            aggregates = new TransactionAggregates();
                        }
                        aggregates.addEmission(transaction.getCarbonEmission());
                        return aggregates;
                    });
                });

                hasMoreData = !transactionPage.isLast();
                pageNumber++;

                logger.debug("Processed global mapped transactions batch {} with {} transactions", pageNumber, transactions.size());
            } catch (Exception e) {
                logger.error("Error processing global mapped transactions batch {}: {}", pageNumber, e.getMessage(), e);
                hasMoreData = false;
            }
        }
    }

    private static class TransactionAggregates {
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private BigDecimal totalEmission = BigDecimal.ZERO;
        private final Object lock = new Object(); // Finer-grained lock

        public void addAmount(BigDecimal amount) {
            if (amount != null) {
                synchronized (lock) {
                    totalAmount = totalAmount.add(amount);
                }
            }
        }

        public void addEmission(BigDecimal emission) {
            if (emission != null) {
                synchronized (lock) {
                    totalEmission = totalEmission.add(emission);
                }
            }
        }

        public BigDecimal getTotalAmount() {
            synchronized (lock) {
                return totalAmount;
            }
        }

        public BigDecimal getTotalEmission() {
            synchronized (lock) {
                return totalEmission;
            }
        }
    }

    @Override
    @Transactional
    public void resetMonthSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Resetting monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
    }

    @Override
    @Transactional
    public List<MonthlyCategorySummary> rebuildSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Rebuilding monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        return processTransactionsInBatches(userId, yearMonth, new ArrayList<>(), startOfMonth, LocalDateTime.now());
    }
}