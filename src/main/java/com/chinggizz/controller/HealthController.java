package com.chinggizz.controller;

import lombok.extern.slf4j.Slf4j;
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
 * Provides endpoints for monitoring and keeping the service alive
 */
@Slf4j
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Simple health check endpoint
     * Used by cron-job.org to keep Render instance alive
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        log.info("🏥 Health check ping received at {}", LocalDateTime.now().format(formatter));
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Chinggizz Gifting Platform");
        response.put("timestamp", LocalDateTime.now().format(formatter));
        response.put("message", "Service is running smoothly! 🎁");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Detailed health check with system info
     */
    @GetMapping("/detailed")
    public ResponseEntity<Map<String, Object>> detailedHealthCheck() {
        log.info("🔍 Detailed health check requested");
        
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Chinggizz Gifting Platform");
        response.put("timestamp", LocalDateTime.now().format(formatter));
        response.put("uptime", "Active");
        
        Map<String, String> memory = new HashMap<>();
        memory.put("total", formatBytes(totalMemory));
        memory.put("used", formatBytes(usedMemory));
        memory.put("free", formatBytes(freeMemory));
        response.put("memory", memory);
        
        return ResponseEntity.ok(response);
    }

    private String formatBytes(long bytes) {
        long mb = bytes / (1024 * 1024);
        return mb + " MB";
    }
}

