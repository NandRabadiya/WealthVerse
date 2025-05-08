package com.example.wealthverse.DTO;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class AddTransactionRequest {

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private PaymentMode paymentMode;

    private String merchantId;

    private String merchantName;

    private TransactionType transactionType;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;



}
