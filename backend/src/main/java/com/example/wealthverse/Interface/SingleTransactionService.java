package com.example.wealthverse.Interface;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.Model.Transaction;

public interface SingleTransactionService {
    Transaction addTransaction(AddTransactionRequest request, String authHeader);
}




