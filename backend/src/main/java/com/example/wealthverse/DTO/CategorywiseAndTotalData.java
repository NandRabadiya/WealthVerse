package com.example.wealthverse.DTO;



import lombok.*;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CategorywiseAndTotalData {

    private List<CategorySummaryResponse> categorySummaries;
    private MonthlySummaryResponse response;

    public List<CategorySummaryResponse> getCategorySummaries() {
        return categorySummaries;
    }

    public void setCategorySummaries(List<CategorySummaryResponse> categorySummaries) {
        this.categorySummaries = categorySummaries;
    }

    public MonthlySummaryResponse getResponse() {
        return response;
    }

    public void setResponse(MonthlySummaryResponse response) {
        this.response = response;
    }
}

