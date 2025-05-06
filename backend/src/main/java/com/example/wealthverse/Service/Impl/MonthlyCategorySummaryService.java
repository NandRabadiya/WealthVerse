package com.example.wealthverse.Service.Impl;
import com.example.wealthverse.Model.MonthlyCategorySummary;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Repository.MonthlyCategorySummaryRepository;
import com.example.wealthverse.Repository.TransactionRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MonthlyCategorySummaryService {
    private static final Logger logger = LoggerFactory.getLogger(MonthlyCategorySummaryService.class);
    private static final int BATCH_SIZE = 500; // Configure based on your system characteristics

    private final MonthlyCategorySummaryRepository summaryRepository;
    private final TransactionRepository transactionRepository;

    @Autowired
    public MonthlyCategorySummaryService(
            MonthlyCategorySummaryRepository summaryRepository,
            TransactionRepository transactionRepository) {
        this.summaryRepository = summaryRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Gets or creates user's monthly spending and carbon emission summary.
     * Uses incremental aggregation with batching to optimize performance.
     *
     * @param userId The user ID
     * @param yearMonth The year and month for which to get the summary
     * @return List of category summaries for the month
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<MonthlyCategorySummary> getUserMonthlySummary(Long userId, YearMonth yearMonth) {
        logger.debug("Retrieving monthly summary for user {} for {}", userId, yearMonth);
        LocalDateTime now = LocalDateTime.now();

        // Get existing summaries for the month
        List<MonthlyCategorySummary> existingSummaries = summaryRepository.findByUserIdAndYearMonth(userId, yearMonth);

        // Find the oldest last_aggregated_at timestamp from existing summaries
        LocalDateTime oldestAggregationTime = existingSummaries.stream()
                .map(MonthlyCategorySummary::getLastAggregatedAt)
                .min(LocalDateTime::compareTo)
                .orElse(yearMonth.atDay(1).atStartOfDay()); // Default to start of month if no summaries

        logger.debug("Processing transactions since {}", oldestAggregationTime);

        // Use the batch processing method to handle large transaction volumes
        return processTransactionsInBatches(userId, yearMonth, existingSummaries, oldestAggregationTime, now);
    }

    /**
     * Process transactions in batches to prevent memory issues with large datasets
     */
    private List<MonthlyCategorySummary> processTransactionsInBatches(
            Long userId,
            YearMonth yearMonth,
            List<MonthlyCategorySummary> existingSummaries,
            LocalDateTime oldestAggregationTime,
            LocalDateTime updatedAt) {

        // Create a map of existing summaries by category ID for easy access
        Map<Long, MonthlyCategorySummary> summaryByCategory = existingSummaries.stream()
                .collect(Collectors.toMap(
                        MonthlyCategorySummary::getCategoryId,
                        summary -> summary
                ));

        // Use ConcurrentHashMap for thread safety
        Map<Long, TransactionAggregates> aggregatesByCategory = new ConcurrentHashMap<>();

        // Initialize page number and flag
        int pageNumber = 0;
        boolean hasMoreData = true;

        // Process transactions in batches
        while (hasMoreData) {
            Pageable pageable = PageRequest.of(pageNumber, BATCH_SIZE);

            // Fetch a batch of transactions
            Page<Transaction> transactionPage = transactionRepository.findTransactionsSincePaged(
                    userId, yearMonth, oldestAggregationTime, pageable);

            List<Transaction> transactions = transactionPage.getContent();

            if (transactions.isEmpty()) {
                // No new transactions in this batch
                hasMoreData = false;
                continue;
            }

            // Aggregate this batch of transactions
            for (Transaction transaction : transactions) {
                Long categoryId = transaction.getCategory().getId();

                TransactionAggregates aggregates = aggregatesByCategory.computeIfAbsent(
                        categoryId, k -> new TransactionAggregates());

                aggregates.addAmount(transaction.getAmount());
                aggregates.addEmission(transaction.getCarbonEmission());
            }

            // Check if we have more pages to process
            hasMoreData = !transactionPage.isLast();
            pageNumber++;

            logger.debug("Processed batch {} with {} transactions", pageNumber, transactions.size());
        }

        // If no new transactions were found, return existing summaries
        if (aggregatesByCategory.isEmpty()) {
            return existingSummaries;
        }

        // Update or create summaries with the aggregated data
        for (Map.Entry<Long, TransactionAggregates> entry : aggregatesByCategory.entrySet()) {
            Long categoryId = entry.getKey();
            TransactionAggregates aggregates = entry.getValue();

            MonthlyCategorySummary summary = summaryByCategory.get(categoryId);

            if (summary == null) {
                // Create new summary if it doesn't exist
                summary = new MonthlyCategorySummary(
                        userId,
                        yearMonth,
                        categoryId,
                        aggregates.getTotalAmount(),
                        aggregates.getTotalEmission(),
                        updatedAt
                );
            } else {
                // Update existing summary
                summary.setTotalAmount(summary.getTotalAmount().add(aggregates.getTotalAmount()));
                summary.setTotalEmission(summary.getTotalEmission().add(aggregates.getTotalEmission()));
                summary.setLastAggregatedAt(updatedAt);
            }

            // Save to database - could be optimized further with batch save operations
            try {
                summaryRepository.save(summary);
                summaryByCategory.put(categoryId, summary);
            } catch (Exception e) {
                logger.error("Error saving summary for category {}: {}", categoryId, e.getMessage());
                // Handle the exception based on your requirements
            }
        }

        // Return the updated list of summaries
        return summaryByCategory.values().stream().toList();
    }

    /**
     * Helper class to aggregate transaction amounts and emissions
     * Made thread-safe with synchronized methods
     */
    private static class TransactionAggregates {
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private BigDecimal totalEmission = BigDecimal.ZERO;

        public synchronized void addAmount(BigDecimal amount) {
            if (amount != null) {
                totalAmount = totalAmount.add(amount);
            }
        }

        public synchronized void addEmission(BigDecimal emission) {
            if (emission != null) {
                totalEmission = totalEmission.add(emission);
            }
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public BigDecimal getTotalEmission() {
            return totalEmission;
        }
    }

    /**
     * Reset a user's summary for a specific month. Useful for recalculations or testing.
     */
    @Transactional
    public void resetMonthSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Resetting monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
    }

    /**
     * Rebuild summaries from scratch for a user and month.
     * Useful when data consistency issues are detected.
     */
    @Transactional
    public List<MonthlyCategorySummary> rebuildSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Rebuilding monthly summaries for user {} for {}", userId, yearMonth);

        // First, remove existing summaries
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);

        // Then set oldest aggregation time to start of month to process all transactions
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();

        // Process all transactions for the month from scratch
        return processTransactionsInBatches(userId, yearMonth, List.of(), startOfMonth, LocalDateTime.now());
    }
}