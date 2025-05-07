package com.example.wealthverse.Service;


import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.Enums.PaymentMode;
import com.example.wealthverse.Enums.TransactionType;
import com.example.wealthverse.Interface.SingleTransactionService;
import com.example.wealthverse.Model.MerchantCategoryMapping;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Repository.MerchantCategoryMappingRepository;
import com.example.wealthverse.Repository.TransactionRepository;
import com.example.wealthverse.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SingleTransactionServiceImpl implements SingleTransactionService {

    private final TransactionRepository transactionRepository;
    private final MerchantCategoryMappingRepository mappingRepository;
    private final UserRepository userRepository;

    @Autowired
    private final JWTService jwtService;

    public SingleTransactionServiceImpl(TransactionRepository transactionRepository,
                                  MerchantCategoryMappingRepository mappingRepository,
                                  UserRepository userRepository,
                                  JWTService jwtService) {
        this.transactionRepository = transactionRepository;
        this.mappingRepository = mappingRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public Transaction addTransaction(AddTransactionRequest request, String authHeader) {
        // 1. Extract user
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtService.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 2. Lookup category mapping
        MerchantCategoryMapping mapping = mappingRepository
                .findByMerchantNameAndIsGlobalMappingTrue(request.getMerchantName())
                .orElseThrow(() -> new IllegalStateException(
                        "No global mapping for merchant: " + request.getMerchantName()));

        // 3. Build and save entity
        Transaction tx = new Transaction();
        tx.setAmount(request.getAmount());
        tx.setPaymentMode(request.getPaymentMode());
        tx.setMerchantId(request.getMerchantId());
        tx.setMerchantName(request.getMerchantName());
        tx.setTransactionType(request.getTransactionType());
        tx.setCreatedAt(request.getCreatedAt() != null ?
                request.getCreatedAt() : LocalDateTime.now());
        tx.setUser(user);
        tx.setCategory(mapping.getCategory());
        tx.setCarbon_emitted(BigDecimal.ZERO);
        return transactionRepository.save(tx);
    }
}


