package com.example.wealthverse.DTO;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {

    private Long id;

    private Double amount;

    private PaymentMode paymentMode;

    private String merchantId;

    private String merchantName;

    private TransactionType transactionType;

    private Long userId;

    private Long categoryId;

    private BigDecimal carbonEmitted;

    private LocalDateTime createdAt;
}
