package com.chinggizz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * API Root Controller
 * Provides API information and available endpoints
 */
@RestController
@RequestMapping("/api")
public class ApiRootController {
    
    @GetMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "Chinggizz - Customised Gifts & Surprise Platform");
        response.put("version", "1.0.0");
        response.put("status", "running");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("categories", "/api/categories");
        endpoints.put("products", "/api/products");
        endpoints.put("hamperBoxes", "/api/hamper-boxes");
        endpoints.put("createOrder", "/api/orders/create");
        endpoints.put("adminLogin", "/api/auth/login");

        response.put("publicEndpoints", endpoints);
        response.put("database", "Supabase PostgreSQL (Cloud)");
        response.put("documentation", "See API_DOCUMENTATION.md for complete API reference");
        
        return ResponseEntity.ok(response);
    }
}

