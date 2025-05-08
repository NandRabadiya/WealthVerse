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


}

