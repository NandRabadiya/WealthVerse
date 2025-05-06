package com.example.wealthverse.Controller;

import com.example.wealthverse.Model.User;
import com.example.wealthverse.DTO.AuthenticationRequest;
import com.example.wealthverse.DTO.AuthenticationResponse;
import com.example.wealthverse.DTO.RefreshTokenRequest;
import com.example.wealthverse.DTO.RegisterRequest;
import com.example.wealthverse.Repository.TokenRepository;
import com.example.wealthverse.Repository.UserRepository;
import com.example.wealthverse.Service.JWTService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AuthenticationController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            TokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthenticationResponse(null, null, "Email already registered"));
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDob(request.getDob());
        user.setCreatedAt(LocalDateTime.now());


        // Save user
        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Save tokens
        jwtService.saveUserToken(accessToken, refreshToken, user);

        // Return response
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthenticationResponse(accessToken, refreshToken, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody AuthenticationRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // Revoke existing tokens
        jwtService.revokeAllUserTokens(user);

        // Generate new tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Save tokens
        jwtService.saveUserToken(accessToken, refreshToken, user);

        // Return response
        return ResponseEntity.ok(new AuthenticationResponse(accessToken, refreshToken, "Login successful"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // Extract email from token
        String email = jwtService.extractUsername(refreshToken);

        if (email != null) {
            // Get user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

            // Validate refresh token
            if (jwtService.isValidRefreshToken(refreshToken, user)) {
                // Generate new access token
                String accessToken = jwtService.generateAccessToken(user);

                // Return new tokens
                return ResponseEntity.ok(new AuthenticationResponse(
                        accessToken,
                        refreshToken, // Keep same refresh token
                        "Token refreshed successfully"
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthenticationResponse(null, null, "Invalid refresh token"));
    }

    public TokenRepository getTokenRepository() {
        return tokenRepository;
    }
}