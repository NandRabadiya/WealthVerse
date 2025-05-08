package com.example.wealthverse.DTO;


import lombok.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response object for monthly spending and carbon emission summaries
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MonthlySummaryResponse {

    private String yearMonth;
    private List<CategorySummaryResponse> categorySummaries;
    private BigDecimal totalSpending = BigDecimal.ZERO;
    private BigDecimal totalEmission = BigDecimal.ZERO;




    /**
     * Calculate total spending and emissions across all categories
     * Also calculate the percentage of emissions for each category
     */
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
}

