package com.example.wealthverse.Repository;

import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Find all transactions for a given user in a specific month
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month")
    List<Transaction> findByUserIdAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    /**
     * Find all transactions for a user in a specific month that occurred after a given timestamp
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND YEAR(t.createdAt) = :#{#yearMonth.year} " +
            "AND MONTH(t.createdAt) = :#{#yearMonth.monthValue} " +
            "AND t.createdAt > :since")
    List<Transaction> findTransactionsSince(
            @Param("userId") Long userId,
            @Param("yearMonth") YearMonth yearMonth,
            @Param("since") LocalDateTime since);

    /**
     * Paginated version of findTransactionsSince to handle large volumes of data
     * Only returns DEBIT transactions
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
            "AND YEAR(t.createdAt) = :#{#yearMonth.year} " +
            "AND MONTH(t.createdAt) = :#{#yearMonth.monthValue} " +
            "AND t.createdAt > :since " +
            "AND t.transactionType = com.example.wealthverse.Enums.TransactionType.DEBIT " +
            "ORDER BY t.createdAt ASC")
    Page<Transaction> findTransactionsSincePaged(
            @Param("userId") Long userId,
            @Param("yearMonth") YearMonth yearMonth,
            @Param("since") LocalDateTime since,
            Pageable pageable);

    /**
     * Find all DEBIT transactions for a user in a specific month that occurred after a given timestamp
     * Only consider transactions where the merchant has a global mapping
     */
    @Query("SELECT t FROM Transaction t " +
            "WHERE t.user.id = :userId " +
            "AND YEAR(t.createdAt) = :#{#yearMonth.year} " +
            "AND MONTH(t.createdAt) = :#{#yearMonth.monthValue} " +
            "AND t.createdAt > :since " +
            "AND t.transactionType = com.example.wealthverse.Enums.TransactionType.DEBIT " +
            "AND EXISTS (SELECT m FROM MerchantCategoryMapping m " +
            "            WHERE m.merchantName = t.merchantName " +
            "            AND m.isGlobalMapping = true) " +
            "ORDER BY t.createdAt ASC")
    Page<Transaction> findGlobalMappedTransactionsSincePaged(
            @Param("userId") Long userId,
            @Param("yearMonth") YearMonth yearMonth,
            @Param("since") LocalDateTime since,
            Pageable pageable);

    Page<Transaction> findAllByUserId(Long userId, Pageable pageable);

    /**
     * Count transactions in a specific month for a user
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId " +
            "AND YEAR(t.createdAt) = :year AND MONTH(t.createdAt) = :month")
    long countByUserIdAndMonth(
            @Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);
}