package com.example.wealthverse.Controller;

import com.example.wealthverse.DTO.CategorySummaryResponse;
import com.example.wealthverse.DTO.CategorywiseAndTotalData;
import com.example.wealthverse.DTO.MonthlySummaryResponse;
import com.example.wealthverse.DTO.MultiMonthSummaryResponse;
import com.example.wealthverse.Model.MonthlyCategorySummary;
import com.example.wealthverse.Service.MonthlyCategorySummaryService;
import com.example.wealthverse.Service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class MonthlySummaryController {

    private final MonthlyCategorySummaryService summaryService;
    private final JWTService jwtService;

    @Autowired
    public MonthlySummaryController(MonthlyCategorySummaryService summaryService, JWTService jwtService) {
        this.summaryService = summaryService;
        this.jwtService = jwtService;
    }

    @GetMapping("/monthly/{yearMonth}")
    public ResponseEntity<MonthlySummaryResponse> getMonthlySummary(
               @RequestHeader("Authorization") String token,
               @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {

           // Extract user ID from token
           Long userId = jwtService.getUserIdFromToken(token);
           if (userId == null) {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
           }

           // Get monthly summary from service
           MonthlySummaryResponse response = summaryService.getMonthlySummaryForUser(userId, yearMonth);

           return ResponseEntity.ok(response);
       }


    @GetMapping("/last-five-months/{yearMonth}")
    public ResponseEntity<MultiMonthSummaryResponse> getLast5MonthsSummary(
            @RequestHeader("Authorization") String token,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {

        Long userId = jwtService.getUserIdFromToken(token);


        // Get 5-month summary (current month + 4 previous months)
        MultiMonthSummaryResponse response = summaryService.getMultiMonthSummaryForUser(userId, yearMonth, 5);
        return ResponseEntity.ok(response);
    }

}