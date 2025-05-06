package com.example.wealthverse.Repository;

import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    List<Transaction> findByCategory_NameAndUser(String categoryName, User user);

    List<Transaction> findByTransactionTypeAndUser(TransactionType transactionType, User user);
}
