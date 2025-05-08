package com.example.wealthverse.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mappings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MerchantCategoryMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String merchantName;

    private Boolean isGlobalMapping = false;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;

    @ManyToOne(optional = true)
    private User user; // null if global

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}

