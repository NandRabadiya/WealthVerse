package com.example.wealthverse.DTO;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryApplyRequest {
    private Long transactionId;           // required only if applyToAll=false
    private String merchantName;          // merchant to remap
    private String newCategoryName;       // name of the category to apply
    private boolean applyToAll;           // true → apply to all txns, false → single

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getNewCategoryName() {
        return newCategoryName;
    }

    public void setNewCategoryName(String newCategoryName) {
        this.newCategoryName = newCategoryName;
    }

    public boolean isApplyToAll() {
        return applyToAll;
    }

    public void setApplyToAll(boolean applyToAll) {
        this.applyToAll = applyToAll;
    }
}
