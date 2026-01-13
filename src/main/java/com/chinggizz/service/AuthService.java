package com.chinggizz.service;

import com.chinggizz.dto.LoginRequest;
import com.chinggizz.dto.LoginResponse;
import com.chinggizz.entity.Admin;
import com.chinggizz.exception.BadRequestException;
import com.chinggizz.repository.AdminRepository;
import com.chinggizz.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Authentication operations
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        Admin admin = adminRepository.findByUsernameAndActiveTrue(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }
        
        String token = jwtUtil.generateToken(admin.getUsername());
        
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .username(admin.getUsername())
                .fullName(admin.getFullName())
                .build();
    }
}

