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
import java.util.concurrent.ConcurrentHashMap;
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

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public List<MonthlyCategorySummary> getUserMonthlySummary(Long userId, YearMonth yearMonth) {
        logger.debug("Retrieving monthly summary for user {} for {}", userId, yearMonth);
        LocalDateTime now = LocalDateTime.now();

        List<MonthlyCategorySummary> existingSummaries = summaryRepository.findByUserIdAndYearMonth(userId, yearMonth);

        LocalDateTime oldestAggregationTime = existingSummaries.stream()
                .map(MonthlyCategorySummary::getLastAggregatedAt)
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

        Map<Long, MonthlyCategorySummary> summaryByCategory = existingSummaries.stream()
                .collect(Collectors.toMap(
                        MonthlyCategorySummary::getCategoryId,
                        summary -> summary
                ));

        Map<Long, TransactionAggregates> aggregatesByCategory = new ConcurrentHashMap<>();

        int pageNumber = 0;
        boolean hasMoreData = true;

        while (hasMoreData) {
            Pageable pageable = PageRequest.of(pageNumber, BATCH_SIZE);

            Page<Transaction> transactionPage = transactionRepository.findTransactionsSincePaged(
                    userId, yearMonth, oldestAggregationTime, pageable);

            List<Transaction> transactions = transactionPage.getContent();

            if (transactions.isEmpty()) {
                hasMoreData = false;
                continue;
            }

            for (Transaction transaction : transactions) {
                Long categoryId = transaction.getCategory().getId();

                TransactionAggregates aggregates = aggregatesByCategory.computeIfAbsent(
                        categoryId, k -> new TransactionAggregates());

                aggregates.addAmount(transaction.getAmount());
                aggregates.addEmission(transaction.getCarbonEmission());
            }

            hasMoreData = !transactionPage.isLast();
            pageNumber++;

            logger.debug("Processed batch {} with {} transactions", pageNumber, transactions.size());
        }

        if (aggregatesByCategory.isEmpty()) {
            return existingSummaries;
        }

        for (Map.Entry<Long, TransactionAggregates> entry : aggregatesByCategory.entrySet()) {
            Long categoryId = entry.getKey();
            TransactionAggregates aggregates = entry.getValue();

            MonthlyCategorySummary summary = summaryByCategory.get(categoryId);

            if (summary == null) {
                summary = new MonthlyCategorySummary(
                        userId,
                        yearMonth,
                        categoryId,
                        aggregates.getTotalAmount(),
                        aggregates.getTotalEmission(),
                        updatedAt
                );
            } else {
                summary.setTotalAmount(summary.getTotalAmount().add(aggregates.getTotalAmount()));
                summary.setTotalEmission(summary.getTotalEmission().add(aggregates.getTotalEmission()));
                summary.setLastAggregatedAt(updatedAt);
            }

            try {
                summaryRepository.save(summary);
                summaryByCategory.put(categoryId, summary);
            } catch (Exception e) {
                logger.error("Error saving summary for category {}: {}", categoryId, e.getMessage());
            }
        }

        return summaryByCategory.values().stream().toList();
    }

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

    @Transactional
    public void resetMonthSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Resetting monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
    }

    @Transactional
    public List<MonthlyCategorySummary> rebuildSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Rebuilding monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
        LocalDateTime startOfMonth = yearMonth.atDay(1).atStartOfDay();
        return processTransactionsInBatches(userId, yearMonth, List.of(), startOfMonth, LocalDateTime.now());
    }
}
