package com.example.wealthverse.DTO;



import java.util.List;

public class CategorywiseAndTotalData {

    private List<CategorySummaryResponse> categorySummaries;
    private MonthlySummaryResponse response;

    // Getter and Setter for categorySummaries
    public List<CategorySummaryResponse> getCategorySummaries() {
        return categorySummaries;
    }

    public void setCategorySummaries(List<CategorySummaryResponse> categorySummaries) {
        this.categorySummaries = categorySummaries;
    }

    // Getter and Setter for response
    public MonthlySummaryResponse getResponse() {
        return response;
    }

    public void setResponse(MonthlySummaryResponse response) {
        this.response = response;
    }
}

