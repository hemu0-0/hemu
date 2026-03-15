package com.portfolio.domain.auth.service;

import com.portfolio.domain.auth.dto.LoginRequestDto;
import com.portfolio.domain.auth.dto.LoginResponseDto;
import com.portfolio.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${admin.password}")
    private String adminPassword;

    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponseDto login(LoginRequestDto dto) {
        if (!adminPassword.equals(dto.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return new LoginResponseDto(jwtTokenProvider.generateToken());
    }
}
