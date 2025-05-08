package com.example.wealthverse.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
    private String message;
    private Integer id;




}
