package com.example.wealthverse.DTO;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddTransactionRequest {
    private Double amount;

    private PaymentMode paymentMode;

    private String merchantId;

    private String merchantName;

    private TransactionType transactionType;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
