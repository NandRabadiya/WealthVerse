package com.example.wealthverse.DTO;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CategorySummaryResponse {

    private Long categoryId;
    private String categoryName;
    private BigDecimal totalAmount;
    private BigDecimal totalEmission;
    private BigDecimal emissionPercentage;



    public void calculateEmissionPercentage(BigDecimal totalEmissions) {
        if (totalEmissions == null || totalEmissions.compareTo(BigDecimal.ZERO) <= 0) {
            this.emissionPercentage = BigDecimal.ZERO;
            return;
        }

        if (this.totalEmission == null) {
            this.emissionPercentage = BigDecimal.ZERO;
            return;
        }

        // Calculate percentage with 2 decimal places
        this.emissionPercentage = this.totalEmission
                .multiply(new BigDecimal("100"))
                .divide(totalEmissions, 2, RoundingMode.HALF_UP);
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission;
    }

    public BigDecimal getEmissionPercentage() {
        return emissionPercentage;
    }

    public void setEmissionPercentage(BigDecimal emissionPercentage) {
        this.emissionPercentage = emissionPercentage;
    }
}