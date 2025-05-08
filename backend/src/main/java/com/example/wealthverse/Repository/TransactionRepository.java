package com.example.wealthverse.Repository;

import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Model.Category;
import com.example.wealthverse.Model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findAllByUserId(Long userId, Pageable pageable);

    // Category & Merchant Mapping
    @Modifying
    @Transactional
    @Query("UPDATE Transaction t SET t.category = :category WHERE t.user.id = :userId AND UPPER(t.merchantName) = UPPER(:merchantName)")
    int bulkUpdateCategory(@Param("category") Category category, @Param("userId") Long userId, @Param("merchantName") String merchantName);
    List<Transaction> findByUserIdAndMerchantNameAndTransactionType(Long userId, String merchantName, TransactionType transactionType);


    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND MONTH(t.createdAt) = :month AND YEAR(t.createdAt) = :year")
    Page<Transaction> findAllByUserIdAndMonth(@Param("userId") Long userId,
                                              @Param("month") int month,
                                              @Param("year") int year,
                                              Pageable pageable);


}