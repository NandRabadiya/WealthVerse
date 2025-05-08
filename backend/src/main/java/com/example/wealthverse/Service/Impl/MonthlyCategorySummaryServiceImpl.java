package com.example.wealthverse.Service.Impl;

import com.example.wealthverse.DTO.CategorySummaryResponse;
import com.example.wealthverse.DTO.MonthlySummaryResponse;
import com.example.wealthverse.DTO.MultiMonthSummaryResponse;
import com.example.wealthverse.Enums.TransactionType;
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
    @Transactional
    public void resetMonthSummaries(Long userId, YearMonth yearMonth) {
        logger.info("Resetting monthly summaries for user {} for {}", userId, yearMonth);
        summaryRepository.deleteByUserIdAndYearMonth(userId, yearMonth);
    }


    @Override
    @Transactional
    public void updateMonthlySummaries(List<Transaction> transactions) {
        Map<String, MonthlyCategorySummary> summaryMap = new HashMap<>();

        for (Transaction tx : transactions) {
            if (tx.getTransactionType() != TransactionType.DEBIT || tx.getAmount() == null) {
                continue;
            }

            YearMonth yearMonth = YearMonth.from(tx.getCreatedAt());
            Long userId = tx.getUser().getId();
            Long categoryId = tx.getCategory() != null ? tx.getCategory().getId() : null;
            if (categoryId == null) continue;

            String key = userId + "_" + yearMonth + "_" + categoryId;

            summaryMap.computeIfAbsent(key, k -> {
                return summaryRepository
                        .findByUserIdAndYearMonthAndCategoryId(userId, yearMonth, categoryId)
                        .orElse(new MonthlyCategorySummary(
                                userId, yearMonth, categoryId,
                                BigDecimal.ZERO, BigDecimal.ZERO,
                                LocalDateTime.now()
                        ));
            });

            MonthlyCategorySummary summary = summaryMap.get(key);
            summary.addToTotalAmount(tx.getAmount());

            if (Boolean.TRUE.equals(tx.getIsGloballyMapped()) && tx.getCarbonEmission() != null) {
                summary.addToTotalEmission(tx.getCarbonEmission());
            }

            summary.setLastAggregatedAt(LocalDateTime.now());
        }

        summaryRepository.saveAll(summaryMap.values());
    }


    @Override
    public MonthlySummaryResponse getMonthlySummaryForUser(Long userId, YearMonth yearMonth) {
        // Fetch data from repository
        List<MonthlyCategorySummary> monthlySummaries =
                summaryRepository.findByUserIdAndYearMonthWithCategory(userId, yearMonth);

        // Create response DTO
        MonthlySummaryResponse response = new MonthlySummaryResponse();
        response.setYearMonth(yearMonth.toString()); // Using YearMonth's default toString()

        // Map entity data to DTOs
        List<CategorySummaryResponse> categorySummaries = monthlySummaries.stream()
                .map(this::mapToCategorySummaryResponse)
                .collect(Collectors.toList());

        response.setCategorySummaries(categorySummaries);

        // Calculate totals and percentages
        response.calculateTotals();

        return response;
    }

    private CategorySummaryResponse mapToCategorySummaryResponse(MonthlyCategorySummary summary) {
        CategorySummaryResponse dto = new CategorySummaryResponse();

        dto.setCategoryId(summary.getCategoryId());

        // Safely access category name (in case category is null)
        if (summary.getCategory() != null) {
            dto.setCategoryName(summary.getCategory().getName());
        } else {
            dto.setCategoryName("Unknown Category");
        }

        dto.setTotalAmount(summary.getTotalAmount());
        dto.setTotalEmission(summary.getTotalEmission());

        return dto;
    }

    @Override
    public MultiMonthSummaryResponse getMultiMonthSummaryForUser(Long userId, YearMonth currentYearMonth, int numberOfMonths) {
        // Create the response object
        MultiMonthSummaryResponse response = new MultiMonthSummaryResponse();

        // Set date range
        YearMonth endYearMonth = currentYearMonth;
        YearMonth startYearMonth = currentYearMonth.minusMonths(numberOfMonths - 1);
        response.setStartYearMonth(startYearMonth);
        response.setEndYearMonth(endYearMonth);

        // Fetch all data for the date range at once
        List<MonthlyCategorySummary> allMonthlySummaries =
                summaryRepository.findByUserIdAndYearMonthRangeWithCategory(userId, startYearMonth, endYearMonth);

        // Group by YearMonth
        Map<YearMonth, List<MonthlyCategorySummary>> summariesByMonth = allMonthlySummaries.stream()
                .collect(Collectors.groupingBy(
                        MonthlyCategorySummary::getYearMonth
                ));

        // Process each month's data
        List<MonthlySummaryResponse> monthlySummaries = new ArrayList<>();
        YearMonth yearMonth = startYearMonth;

        while (!yearMonth.isAfter(endYearMonth)) {
            MonthlySummaryResponse monthlySummary = new MonthlySummaryResponse();
            monthlySummary.setYearMonth(yearMonth.toString());

            // Get this month's category summaries if they exist
            List<MonthlyCategorySummary> thisMonthSummaries = summariesByMonth.getOrDefault(yearMonth, Collections.emptyList());

            // Map entity data to DTOs
            List<CategorySummaryResponse> categorySummaries = thisMonthSummaries.stream()
                    .map(this::mapToCategorySummaryResponse)
                    .collect(Collectors.toList());

            monthlySummary.setCategorySummaries(categorySummaries);

            // Calculate totals and percentages for this month
            monthlySummary.calculateTotals();

            monthlySummaries.add(monthlySummary);
            yearMonth = yearMonth.plusMonths(1);
        }

        response.setMonthlySummaries(monthlySummaries);

        // Calculate totals across all months
        response.calculateTotals();

        return response;
    }
}



