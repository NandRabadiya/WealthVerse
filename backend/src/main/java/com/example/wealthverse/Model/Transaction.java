package com.example.wealthverse.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID tid;

    private Double amount;

    private String paymentMode;       // e.g., UPI, Card, NetBanking

    private String merchantId;

    private String merchantName;

    private String description;

    private String transactionType;   // e.g., debit, credit

    private LocalDateTime transactionTime;


    @PrePersist
    protected void onCreate() {
        this.transactionTime = LocalDateTime.now();
    }
}
