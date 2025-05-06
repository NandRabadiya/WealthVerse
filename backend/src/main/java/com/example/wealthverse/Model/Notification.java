package com.example.wealthverse.Model;


import com.example.wealthverse.Enums.ReferenceType;
import com.example.wealthverse.Enums.NotificationType;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @Column(name = "notification_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Set<User> users = new HashSet<>();


    // @Size(max = 50)
    @Column(name = "type")
    private NotificationType type;

    @Size(max = 255)
    @NotNull
    @Column(name = "title")
    private String title;

    @Not Null
    @Lob
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

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    // Utility method to handle the relationship
    public void addUser(User user) {
        this.users.add(user);
        user.getNotifications().add(this); // Ensures bidirectional consistency
    }

}