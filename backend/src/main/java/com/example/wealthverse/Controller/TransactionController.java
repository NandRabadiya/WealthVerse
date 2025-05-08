package com.example.wealthverse.Controller;

import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.DTO.CategoryApplyRequest;
import com.example.wealthverse.DTO.TransactionDTO;
import com.example.wealthverse.Exception.BadRequestException;
import com.example.wealthverse.Service.TransactionService;
import com.example.wealthverse.Model.ApiResponse;
import com.example.wealthverse.Model.Transaction;
import com.opencsv.exceptions.CsvException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }


    @PostMapping(value = "/import",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> importCsv(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        // Validate file
        if (file == null || file.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Please provide a CSV file",null));
        }

        // Validate file type
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Only CSV files are supported",null));
        }

        try {
            // Process file
            transactionService.importFromCsv(file, authHeader);
            logger.info("Successfully imported CSV file: {}", filename);

            return ResponseEntity.ok(new ApiResponse(true, "CSV imported successfully",null));

        } catch (CsvException e) {
            logger.error("CSV parsing error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Failed to parse CSV: " + e.getMessage(),null));

        } catch (BadRequestException e) {
            logger.error("Validation error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(new ApiResponse(false, e.getMessage(),null));

        } catch (IOException e) {
            logger.error("IO error reading file: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Failed to read CSV file: " + e.getMessage(),null));

        } catch (Exception e) {
            logger.error("Unexpected error during import: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred. Please try again later.",null));
        }
    }


    @PostMapping("/add")
    public ResponseEntity<Transaction> addTransaction(
            @RequestBody AddTransactionRequest request,
            @RequestHeader("Authorization") String authHeader) {
         transactionService.addTransaction(request, authHeader);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @GetMapping("/getall")
    public ResponseEntity<Page<TransactionDTO>> getAllTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer month
    ) {
        Page<TransactionDTO> dtos;

        if (month != null) {
            // If month parameter is provided, get transactions for that month


            dtos = transactionService.getTransactionsByMonth(authHeader, month, page, size);
        } else {
            // Otherwise get all transactions
            dtos = transactionService.getAllTransactions(authHeader, page, size);
        }

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/apply-category")
    public ResponseEntity<String> applyCategory(
            @RequestBody CategoryApplyRequest req,
            @RequestHeader("Authorization") String authHeader) {

        if (req.isApplyToAll()) {
            transactionService.applyCategoryToAllTransactions(req, authHeader);
            return ResponseEntity.ok("Category applied to all transactions for merchant: "
                    + req.getMerchantName());
        } else {
            transactionService.overrideTransactionCategory(req, authHeader);
            return ResponseEntity.ok("Category overridden for transaction ID: "
                    + req.getTransactionId());
        }
    }

}