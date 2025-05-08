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


    @ManyToOne(optional = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public Boolean getGlobalMapping() {
        return isGlobalMapping;
    }

    public void setGlobalMapping(Boolean globalMapping) {
        isGlobalMapping = globalMapping;
    }

    public void setIsGlobalMapping(Boolean isGlobalMapping) {
        this.isGlobalMapping = isGlobalMapping;
    }

    public Boolean getIsGlobalMapping() {
        return isGlobalMapping;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

