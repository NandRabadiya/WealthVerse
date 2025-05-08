package com.example.wealthverse.DTO;


import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response object for monthly spending and carbon emission summaries
 */

@Data
@Builder
@Getter
@Setter
public class MonthlySummaryResponse {

    private String yearMonth;
    private List<CategorySummaryResponse> categorySummaries;
    private BigDecimal totalSpending = BigDecimal.ZERO;
    private BigDecimal totalEmission = BigDecimal.ZERO;

    public MonthlySummaryResponse() {
    }

    public MonthlySummaryResponse(String yearMonth, List<CategorySummaryResponse> categorySummaries, BigDecimal totalSpending, BigDecimal totalEmission) {
        this.yearMonth = yearMonth;
        this.categorySummaries = categorySummaries;
        this.totalSpending = totalSpending;
        this.totalEmission = totalEmission;
    }

    public void calculateTotals() {
        if (categorySummaries != null) {
            totalSpending = categorySummaries.stream()
                    .map(CategorySummaryResponse::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            totalEmission = categorySummaries.stream()
                    .map(CategorySummaryResponse::getTotalEmission)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate emission percentages for each category
            if (totalEmission.compareTo(BigDecimal.ZERO) > 0) {
                categorySummaries.forEach(category ->
                        category.calculateEmissionPercentage(totalEmission)
                );
            }
        }
    }

    public String getYearMonth() {
        return yearMonth;
    }

    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth;
    }

    public List<CategorySummaryResponse> getCategorySummaries() {
        return categorySummaries;
    }

    public void setCategorySummaries(List<CategorySummaryResponse> categorySummaries) {
        this.categorySummaries = categorySummaries;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }

    public void setTotalSpending(BigDecimal totalSpending) {
        this.totalSpending = totalSpending;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission;
    }


}

