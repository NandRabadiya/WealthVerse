package com.example.wealthverse.DTO;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class EmissionCalculationRequest {
    private String categoryName;
    private BigDecimal amountSpent;

}
