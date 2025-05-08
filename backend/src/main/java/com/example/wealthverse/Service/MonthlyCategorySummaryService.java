package com.example.wealthverse.Service;

import com.example.wealthverse.DTO.MonthlySummaryResponse;
import com.example.wealthverse.Model.MonthlyCategorySummary;
import com.example.wealthverse.Model.Transaction;

import java.time.YearMonth;
import java.util.List;

public interface MonthlyCategorySummaryService {
    void resetMonthSummaries(Long userId, YearMonth yearMonth);
    void updateMonthlySummaries(List<Transaction> transactions);
    MonthlySummaryResponse getMonthlySummaryForUser(Long userId, YearMonth yearMonth);

}
