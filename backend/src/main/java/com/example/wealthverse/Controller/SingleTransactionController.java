package com.example.wealthverse.Controller;


import com.example.wealthverse.DTO.AddTransactionRequest;
import com.example.wealthverse.Interface.SingleTransactionService;
import com.example.wealthverse.Model.Transaction;
import com.example.wealthverse.Service.SingleTransactionServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class SingleTransactionController {

    private final SingleTransactionService transactionService;

    public SingleTransactionController(SingleTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(
            @RequestBody AddTransactionRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Transaction saved = transactionService.addTransaction(request, authHeader);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
