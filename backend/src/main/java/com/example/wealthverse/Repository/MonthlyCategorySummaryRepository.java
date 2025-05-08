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


    Optional<MonthlyCategorySummary> findByUserIdAndYearMonthAndCategoryId(
            Long userId, YearMonth yearMonth, Long categoryId);

    void deleteByUserIdAndYearMonth(Long userId, YearMonth yearMonth);


    @Query("SELECT mcs FROM MonthlyCategorySummary mcs " +
            "JOIN FETCH mcs.category " +
            "WHERE mcs.userId = :userId AND mcs.yearMonth = :yearMonth")
    List<MonthlyCategorySummary> findByUserIdAndYearMonthWithCategory(
            @Param("userId") Long userId,
            @Param("yearMonth") YearMonth yearMonth);
}