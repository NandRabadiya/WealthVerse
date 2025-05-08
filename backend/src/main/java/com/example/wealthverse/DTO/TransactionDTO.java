package com.example.wealthverse.DTO;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class TransactionDTO {

    private Long id;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private PaymentMode paymentMode;

    private String merchantId;

    private String merchantName;

    private TransactionType transactionType;

    private Long userId;

    private Long categoryId;

    private String categoryName;

    private BigDecimal carbonEmitted;

    private LocalDateTime createdAt;

    private Boolean isGlobal = false;

}
