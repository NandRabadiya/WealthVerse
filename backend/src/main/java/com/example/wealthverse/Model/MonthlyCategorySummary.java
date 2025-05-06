package com.example.wealthverse.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Objects;

@Entity
@Table(name = "monthly_category_summaries")
public class MonthlyCategorySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "year_month", nullable = false)
    private YearMonth yearMonth;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "total_emission", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalEmission;

    @Column(name = "last_aggregated_at", nullable = false)
    private LocalDateTime lastAggregatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;

    // Default constructor required by JPA
    public MonthlyCategorySummary() {
    }

    // Constructor with essential fields
    public MonthlyCategorySummary(Long userId, YearMonth yearMonth, Long categoryId,
                                  BigDecimal totalAmount, BigDecimal totalEmission,
                                  LocalDateTime lastAggregatedAt) {
        this.userId = userId;
        this.yearMonth = yearMonth;
        this.categoryId = categoryId;
        this.totalAmount = totalAmount;
        this.totalEmission = totalEmission;
        this.lastAggregatedAt = lastAggregatedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public YearMonth getYearMonth() {
        return yearMonth;
    }

    public void setYearMonth(YearMonth yearMonth) {
        this.yearMonth = yearMonth;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission;
    }

    public LocalDateTime getLastAggregatedAt() {
        return lastAggregatedAt;
    }

    public void setLastAggregatedAt(LocalDateTime lastAggregatedAt) {
        this.lastAggregatedAt = lastAggregatedAt;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MonthlyCategorySummary that = (MonthlyCategorySummary) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "MonthlyCategorySummary{" +
                "id=" + id +
                ", userId=" + userId +
                ", yearMonth=" + yearMonth +
                ", categoryId=" + categoryId +
                ", totalAmount=" + totalAmount +
                ", totalEmission=" + totalEmission +
                ", lastAggregatedAt=" + lastAggregatedAt +
                '}';
    }
}