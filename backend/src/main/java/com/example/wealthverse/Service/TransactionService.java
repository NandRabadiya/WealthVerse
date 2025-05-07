package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.Model.Transaction;
import com.opencsv.exceptions.CsvException;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface TransactionService {

    void importFromCsv(MultipartFile csvFile, String authHeader) throws IOException, CsvException, java.io.IOException;
    Transaction addTransaction(AddTransactionRequest request, String authHeader);

}
