package com.example.wealthverse.DTO;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CategoryMappingResponseDTO {

    private Long categoryId;
    private String categoryName;
    private boolean isGlobalCategory;
    private Long mappingId;
    private String merchantName;
    private boolean isGlobalMapping;
    private String message;

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

    public boolean isGlobalCategory() {
        return isGlobalCategory;
    }

    public void setGlobalCategory(boolean globalCategory) {
        isGlobalCategory = globalCategory;
    }

    public Long getMappingId() {
        return mappingId;
    }

    public void setMappingId(Long mappingId) {
        this.mappingId = mappingId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public boolean isGlobalMapping() {
        return isGlobalMapping;
    }

    public void setGlobalMapping(boolean globalMapping) {
        isGlobalMapping = globalMapping;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
