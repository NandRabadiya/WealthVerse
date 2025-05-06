package com.example.wealthverse.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transaction_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID catId;

    @OneToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    private String preferredCategory; // e.g., Food, Shopping, Rent, etc.

    private Boolean applyToAll;       // if true, update similar transactions (same merchant)

    private LocalDateTime assignedTime;

    @PrePersist
    protected void onAssign() {
        this.assignedTime = LocalDateTime.now();
    }
}
