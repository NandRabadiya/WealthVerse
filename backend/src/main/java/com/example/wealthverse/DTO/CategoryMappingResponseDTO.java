package com.example.wealthverse.DTO;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CategoryMappingResponseDTO {

    private Long categoryId;
    private String categoryName;
    private boolean isGlobalCategory;
    private Long mappingId;
    private String merchantName;
    private boolean isGlobalMapping;
    private String message;


}
