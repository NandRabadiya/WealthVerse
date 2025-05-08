package com.example.wealthverse.DTO;

import lombok.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Getter
@Setter
public class MultiMonthSummaryResponse {

    private String startYearMonth;
    private String endYearMonth;
    private List<MonthlySummaryResponse> monthlySummaries = new ArrayList<>();
    private BigDecimal totalSpendingAllMonths = BigDecimal.ZERO;
    private BigDecimal totalEmissionAllMonths = BigDecimal.ZERO;
    private List<MonthlyTotalResponse> monthlyTotals = new ArrayList<>();

    public MultiMonthSummaryResponse(String startYearMonth, String endYearMonth, List<MonthlySummaryResponse> monthlySummaries, BigDecimal totalSpendingAllMonths, BigDecimal totalEmissionAllMonths, List<MonthlyTotalResponse> monthlyTotals) {
        this.startYearMonth = startYearMonth;
        this.endYearMonth = endYearMonth;
        this.monthlySummaries = monthlySummaries;
        this.totalSpendingAllMonths = totalSpendingAllMonths;
        this.totalEmissionAllMonths = totalEmissionAllMonths;
        this.monthlyTotals = monthlyTotals;
    }

    public MultiMonthSummaryResponse() {
    }

    /**
     * Calculate totals across all months
     */
    public void calculateTotals() {
        if (monthlySummaries != null && !monthlySummaries.isEmpty()) {
            // Reset totals
            totalSpendingAllMonths = BigDecimal.ZERO;
            totalEmissionAllMonths = BigDecimal.ZERO;
            monthlyTotals.clear();

            // Calculate totals and collect monthly data points
            for (MonthlySummaryResponse monthly : monthlySummaries) {
                // Add to grand totals
                totalSpendingAllMonths = totalSpendingAllMonths.add(monthly.getTotalSpending());
                totalEmissionAllMonths = totalEmissionAllMonths.add(monthly.getTotalEmission());

                // Add monthly data point
                MonthlyTotalResponse monthlyTotal = new MonthlyTotalResponse();
                monthlyTotal.setYearMonth(monthly.getYearMonth());
                monthlyTotal.setTotalSpending(monthly.getTotalSpending());
                monthlyTotal.setTotalEmission(monthly.getTotalEmission());
                monthlyTotals.add(monthlyTotal);
            }
        }
    }

    public void setMonthlySummaries(List<MonthlySummaryResponse> monthlySummaries) {
        this.monthlySummaries = monthlySummaries;
    }
    // Setters that accept YearMonth objects but store String representations
    public void setStartYearMonth(YearMonth startYearMonth) {
        this.startYearMonth = startYearMonth != null ? startYearMonth.toString() : null;
    }

    public void setEndYearMonth(YearMonth endYearMonth) {
        this.endYearMonth = endYearMonth != null ? endYearMonth.toString() : null;
    }

    /**
     * Inner class representing total spending and emissions for a single month
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class MonthlyTotalResponse {
        private String yearMonth;
        private BigDecimal totalSpending = BigDecimal.ZERO;
        private BigDecimal totalEmission = BigDecimal.ZERO;

        public String getYearMonth() {
            return yearMonth;
        }

        public void setYearMonth(String yearMonth) {
            this.yearMonth = yearMonth;
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
}