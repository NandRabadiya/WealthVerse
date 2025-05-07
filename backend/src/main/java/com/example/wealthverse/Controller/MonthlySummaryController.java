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
    public ResponseEntity<CategorywiseAndTotalData> getMonthlySummary(
            @RequestHeader("Authorization") String token,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {

        Long userId = jwtService.getUserIdFromToken(token);

        // Get the summary data with incremental aggregation
        List<MonthlyCategorySummary> summaries = summaryService.getUserMonthlySummary(userId, yearMonth);

        // Convert to DTOs
        List<CategorySummaryResponse> categorySummaries = summaries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // Calculate totals and percentages
        MonthlySummaryResponse response = new MonthlySummaryResponse();
        response.setYearMonth(yearMonth.toString());
        response.setCategorySummaries(categorySummaries);
        response.calculateTotals();

        // Use null-safe comparator for sorting by emission percentage (highest first)
        response.setCategorySummaries(
                categorySummaries.stream()
                        .sorted(Comparator.comparing(
                                CategorySummaryResponse::getEmissionPercentage,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                        .collect(Collectors.toList())
        );

        CategorywiseAndTotalData dto = new CategorywiseAndTotalData();
        dto.setCategorySummaries(categorySummaries);
        dto.setResponse(response);

        return ResponseEntity.ok(dto);
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
     */
    private CategorySummaryResponse convertToDto(MonthlyCategorySummary summary) {
        CategorySummaryResponse dto = new CategorySummaryResponse();
        dto.setCategoryId(summary.getCategoryId());

        // Null-safe approach: check if category exists before accessing its name
        if (summary.getCategory() != null) {
            dto.setCategoryName(summary.getCategory().getName());
        } else {
            // Set a default or placeholder value if category is null
            dto.setCategoryName("Unknown Category");
        }

        dto.setTotalAmount(summary.getTotalAmount());
        dto.setTotalEmission(summary.getTotalEmission());

        // Initialize with zero to avoid null emission percentage
        dto.setEmissionPercentage(BigDecimal.ZERO);

        return dto;
    }
}