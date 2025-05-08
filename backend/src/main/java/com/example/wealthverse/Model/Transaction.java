package com.example.wealthverse.Model;

import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "transactions")
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    private PaymentMode paymentMode;     // e.g., UPI, Card, NetBanking

    private String merchantId;

    private String merchantName;

    private TransactionType transactionType; // e.g., debit, credit

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name="is_globally_mapped")
    private Boolean isGloballyMapped = false;


    @Column(precision = 17, scale = 5)
    private BigDecimal carbonEmission;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;


}
