package com.example.wealthverse.Model;

import lombok.*;

/**
 * Standard API response model for consistent response formatting
 */


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;

}