package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.DTO.CategoryApplyRequest;
import com.example.wealthverse.DTO.TransactionDTO;
import com.opencsv.exceptions.CsvException;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

public interface TransactionService {

    void importFromCsv(MultipartFile csvFile, String authHeader) throws IOException, CsvException, java.io.IOException;
    void addTransaction(AddTransactionRequest request, String authHeader);
    Page<TransactionDTO> getAllTransactions(String authHeader, int page, int size);
    /** Override category on a single transaction */
    void overrideTransactionCategory(CategoryApplyRequest req, String authHeader);
    public Page<TransactionDTO> getTransactionsByMonth(String authHeader, int month, int page, int size);
    /** Apply category to all of the user’s transactions for this merchant */
    void applyCategoryToAllTransactions(CategoryApplyRequest req, String authHeader);}

