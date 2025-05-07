package com.example.wealthverse.Controller;

import com.example.wealthverse.Interface.TransactionImportService;
import com.example.wealthverse.Model.ApiResponse;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/transactions/import")
public class TransactionImportController {
    private static final Logger logger = LoggerFactory.getLogger(TransactionImportController.class);
    private final TransactionImportService transactionImportService;

    @Autowired
    public TransactionImportController(TransactionImportService transactionImportService) {
        this.transactionImportService = transactionImportService;
    }

    /**
     * Imports transactions from a CSV file
     *
     * @param file CSV file containing transaction data
     * @param authHeader Authentication header with JWT token
     * @return ResponseEntity with success or error message
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> importCsv(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        // Validate file
        if (file == null || file.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Please provide a CSV file"));
        }

        // Validate file type
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Only CSV files are supported"));
        }

        try {
            // Process file
            transactionImportService.importFromCsv(file, authHeader);
            logger.info("Successfully imported CSV file: {}", filename);

            return ResponseEntity.ok(new ApiResponse(true, "CSV imported successfully"));

        } catch (CsvException e) {
            logger.error("CSV parsing error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Failed to parse CSV: " + e.getMessage()));

        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Validation error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(new ApiResponse(false, e.getMessage()));

        } catch (IOException e) {
            logger.error("IO error reading file: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Failed to read CSV file: " + e.getMessage()));

        } catch (Exception e) {
            logger.error("Unexpected error during import: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred. Please try again later."));
        }
    }
}