package com.chinggizz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * Lightweight endpoint for monitoring and keeping the server awake
 * Used by cron jobs to prevent Render.com free tier from sleeping
 */
@RestController
@RequestMapping("/api/health")
public class HealthCheckController {
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Simple health check endpoint
     * Returns minimal response to confirm server is running
     * 
     * @return Health status with timestamp
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", LocalDateTime.now().format(formatter));
        response.put("message", "Server is awake and running");
        response.put("service", "Chinggizz Gifting Platform");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Ping endpoint - even more lightweight
     * Just returns "pong" for minimal overhead
     * 
     * @return Simple pong response
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}

