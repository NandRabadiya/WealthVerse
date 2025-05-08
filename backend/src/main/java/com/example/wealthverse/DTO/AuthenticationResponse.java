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

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AuthenticationResponse(String accessToken, String refreshToken, String message, Integer id) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.message = message;
        this.id = id;
    }
}
