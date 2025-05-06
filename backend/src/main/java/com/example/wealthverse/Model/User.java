package com.example.wealthverse.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uid;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private LocalDate dob; // Date of Birth

    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }
}
