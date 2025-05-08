package com.example.wealthverse.Controller;

import com.example.wealthverse.DTO.CategorySummaryResponse;
import com.example.wealthverse.DTO.CategorywiseAndTotalData;
import com.example.wealthverse.DTO.MonthlySummaryResponse;
import com.example.wealthverse.Model.MonthlyCategorySummary;
import com.example.wealthverse.Service.MonthlyCategorySummaryService;
import com.example.wealthverse.Service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class MonthlySummaryController {

    private final MonthlyCategorySummaryService summaryService;
    private final JWTService jwtService;

    @Autowired
    public MonthlySummaryController(MonthlyCategorySummaryService summaryService, JWTService jwtService) {
        this.summaryService = summaryService;
        this.jwtService = jwtService;
    }

    /**
     * Get monthly spending and carbon emissions summary categorized by spending categories
     * Includes percentage of total carbon emissions for each category
     *
     * @param token JWT token from Authorization header
     * @param yearMonth the target month in format YYYY-MM
     * @return Response containing summary data for the month
     */
    @GetMapping("/monthly/{yearMonth}")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
            @RequestHeader("Authorization") String token,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {

        Long userId = jwtService.getUserIdFromToken(token);

        // Get the summary data with incremental aggregation
        List<MonthlyCategorySummary> summaries = summaryService.getUserMonthlySummary(userId, yearMonth);

        // Calculate total amount and emissions across all categories using streams
        BigDecimal totalAmount = summaries.stream()
                .map(MonthlyCategorySummary::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalEmission = summaries.stream()
                .map(MonthlyCategorySummary::getTotalEmission)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Convert to DTOs and calculate percentages
        List<CategorySummaryResponse> categorySummaries = summaries.stream()
                .map(summary -> convertToDto(summary, totalEmission))
                .toList();

        // Sort by emission percentage (highest first)
        List<CategorySummaryResponse> sortedSummaries = categorySummaries.stream()
                .sorted(Comparator.comparing(
                        CategorySummaryResponse::getEmissionPercentage,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());

        // Create and populate the response objects
        MonthlySummaryResponse monthlyResponse = new MonthlySummaryResponse();
        monthlyResponse.setYearMonth(yearMonth.toString());
        monthlyResponse.setCategorySummaries(sortedSummaries);
        monthlyResponse.setTotalSpending(totalAmount);
        monthlyResponse.setTotalEmission(totalEmission);


        return ResponseEntity.ok(monthlyResponse);
    }

    /**
     * Reset the summary data for a month (admin or testing only)
     */
    @PostMapping("/admin/reset/{userId}/{yearMonth}")
    public ResponseEntity<Void> resetMonthlySummary(
            @PathVariable Long userId,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {

        summaryService.resetMonthSummaries(userId, yearMonth);
        return ResponseEntity.ok().build();
    }

    /**
     * Convert entity to DTO with null-safe category name retrieval
     * and calculate emission percentage based on total emissions
     */
    private CategorySummaryResponse convertToDto(MonthlyCategorySummary summary, BigDecimal totalEmission) {
        CategorySummaryResponse dto = new CategorySummaryResponse();
        dto.setCategoryId(summary.getCategoryId());

        // Null-safe approach: check if category exists before accessing its name
        if (summary.getCategory() != null) {
            dto.setCategoryName(summary.getCategory().getName());
        } else {
            // Set a default or placeholder value if category is null
            dto.setCategoryName("Unknown Category");
        }

        dto.setTotalAmount(summary.getTotalAmount() != null ? summary.getTotalAmount() : BigDecimal.ZERO);
        dto.setTotalEmission(summary.getTotalEmission() != null ? summary.getTotalEmission() : BigDecimal.ZERO);

        // Calculate emission percentage with improved null safety and division by zero protection
        if (totalEmission != null && totalEmission.compareTo(BigDecimal.ZERO) > 0 && summary.getTotalEmission() != null) {
            try {
                // Calculate percentage: (categoryEmission / totalEmission) * 100
                BigDecimal percentage = summary.getTotalEmission()
                        .multiply(new BigDecimal("100"))
                        .divide(totalEmission, 2, BigDecimal.ROUND_HALF_UP);
                dto.setEmissionPercentage(percentage);
            } catch (ArithmeticException e) {
                // Handle potential division issues
                dto.setEmissionPercentage(BigDecimal.ZERO);
            }
        } else {
            dto.setEmissionPercentage(BigDecimal.ZERO);
        }

        return dto;
    }
}