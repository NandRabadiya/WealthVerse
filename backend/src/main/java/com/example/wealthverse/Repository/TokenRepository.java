package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    Optional<Token> findByAccessToken(String accessToken);

    Optional<Token> findByRefreshToken(String refreshToken);

    @Query("SELECT t FROM Token t WHERE t.user.id = ?1 AND t.loggedOut = false")
    List<Token> findAllValidTokensByUser(Long userId);
}