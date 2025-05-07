package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.DTO.TransactionDTO;
import com.example.wealthverse.Model.Transaction;
import com.opencsv.exceptions.CsvException;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;

public interface TransactionService {

    void importFromCsv(MultipartFile csvFile, String authHeader) throws IOException, CsvException, java.io.IOException;
    void addTransaction(AddTransactionRequest request, String authHeader);
    Page<TransactionDTO> getAllTransactions(String authHeader, int page, int size);

}
