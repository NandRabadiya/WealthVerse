package com.example.wealthverse.DTO;

import java.math.BigDecimal;

public class EmissionCalculationRequest {
    private String categoryName;
    private BigDecimal amountSpent;

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getAmountSpent() {
        return amountSpent;
    }

    public void setAmountSpent(BigDecimal amountSpent) {
        this.amountSpent = amountSpent;
    }
}
