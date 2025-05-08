package com.example.wealthverse.Model;


import com.example.wealthverse.Enums.ReferenceType;
import com.example.wealthverse.Enums.NotificationType;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "notifications")

public class Notification {
    @Id
    @Column(name = "notification_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // @Size(max = 50)
    @Column(name = "type")
    private NotificationType type;

    @Size(max = 255)
    @NotNull
    @Column(name = "title")
    private String title;

    @NotNull
    @Column(name = "message", nullable = false)
    private String message;

    @ColumnDefault("0")
    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "reference_id")
    private int  referenceId;

    // @Size(max = 50)
    @Column(name = "reference_type")
    private ReferenceType referenceType;

    @Column(name = "created_at")
    private Instant createdAt;

}