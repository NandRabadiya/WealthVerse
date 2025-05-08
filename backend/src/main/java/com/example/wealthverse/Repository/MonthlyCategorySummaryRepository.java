package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.MonthlyCategorySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyCategorySummaryRepository extends JpaRepository<MonthlyCategorySummary, Long> {

    /**
     * Find all summaries for a user in a specific month
     */
    List<MonthlyCategorySummary> findByUserIdAndYearMonth(Long userId, YearMonth yearMonth);

    /**
     * Find a specific summary for a user, month, and category combination
     */
    Optional<MonthlyCategorySummary> findByUserIdAndYearMonthAndCategoryId(
            Long userId, YearMonth yearMonth, Long categoryId);

    /**
     * Find summaries that need to be updated based on new transactions
     */
    @Query("SELECT s FROM MonthlyCategorySummary s " +
            "WHERE s.userId = :userId AND s.yearMonth = :yearMonth AND s.lastAggregatedAt < :cutoffTime")
    List<MonthlyCategorySummary> findSummariesNeedingUpdate(
            @Param("userId") Long userId,
            @Param("yearMonth") YearMonth yearMonth,
            @Param("cutoffTime") LocalDateTime cutoffTime);




    @Query("""
  SELECT m
    FROM MonthlyCategorySummary m
   WHERE m.user.id    = :userId
     AND m.yearMonth  = :yearMonth
""")
    List<MonthlyCategorySummary> findByUserAndMonth(
            @Param("userId")    Long userId,
            @Param("yearMonth") String yearMonth);


    /**
     * Delete summaries for a specific user and month
     */
    void deleteByUserIdAndYearMonth(Long userId, YearMonth yearMonth);

    /**
     * Check if a summary exists for a user, month, and category
     */
    boolean existsByUserIdAndYearMonthAndCategoryId(Long userId, YearMonth yearMonth, Long categoryId);
}