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

}
