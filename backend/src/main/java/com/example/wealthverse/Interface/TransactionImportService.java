package com.example.wealthverse.Interface;

import com.opencsv.exceptions.CsvException;
import io.jsonwebtoken.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface TransactionImportService {

    void importFromCsv(MultipartFile csvFile, String authHeader) throws IOException, CsvException, java.io.IOException;
}
