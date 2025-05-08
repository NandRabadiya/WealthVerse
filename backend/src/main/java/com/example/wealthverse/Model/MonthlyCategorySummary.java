package com.example.wealthverse.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Objects;

@Entity
@Table(name = "monthly_category_summaries",
        indexes = {
                @Index(name = "idx_mcs_user_yearmonth", columnList = "user_id, year_month"),
                @Index(name = "idx_mcs_category", columnList = "category_id")
        })
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
    private BigDecimal totalAmount = BigDecimal.ZERO; // Default value to prevent null

    @Column(name = "total_emission", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalEmission = BigDecimal.ZERO; // Default value to prevent null

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
        // Initialize BigDecimal fields to prevent null pointer exceptions
        this.totalAmount = BigDecimal.ZERO;
        this.totalEmission = BigDecimal.ZERO;
    }

    // Constructor with essential fields
    public MonthlyCategorySummary(Long userId, YearMonth yearMonth, Long categoryId,
                                  BigDecimal totalAmount, BigDecimal totalEmission,
                                  LocalDateTime lastAggregatedAt) {
        this.userId = userId;
        this.yearMonth = yearMonth;
        this.categoryId = categoryId;
        this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        this.totalEmission = totalEmission != null ? totalEmission : BigDecimal.ZERO;
        this.lastAggregatedAt = lastAggregatedAt;
    }

    // Getters and setters with null safety
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
        return totalAmount != null ? totalAmount : BigDecimal.ZERO;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
    }

    public BigDecimal getTotalEmission() {
        return totalEmission != null ? totalEmission : BigDecimal.ZERO;
    }

    public void setTotalEmission(BigDecimal totalEmission) {
        this.totalEmission = totalEmission != null ? totalEmission : BigDecimal.ZERO;
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

    /**
     * Safely adds the amount to the existing total amount
     * with proper null handling
     *
     * @param amount Amount to add
     */
    public void addToTotalAmount(BigDecimal amount) {
        if (amount == null) {
            return;
        }
        if (this.totalAmount == null) {
            this.totalAmount = amount;
        } else {
            this.totalAmount = this.totalAmount.add(amount);
        }
    }

    /**
     * Safely adds the emission to the existing total emission
     * with proper null handling
     *
     * @param emission Emission to add
     */
    public void addToTotalEmission(BigDecimal emission) {
        if (emission == null) {
            return;
        }
        if (this.totalEmission == null) {
            this.totalEmission = emission;
        } else {
            this.totalEmission = this.totalEmission.add(emission);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MonthlyCategorySummary that = (MonthlyCategorySummary) o;
        // Using composite business key instead of just ID for better equality comparison
        return Objects.equals(userId, that.userId) &&
                Objects.equals(yearMonth, that.yearMonth) &&
                Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, yearMonth, categoryId);
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