package com.chinggizz.util;

import com.chinggizz.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Utility to generate unique order numbers
 * Thread-safe implementation using UUID to prevent race conditions
 */
@Component
@RequiredArgsConstructor
public class OrderNumberGenerator {

    private static final String PREFIX = "CHG";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private final OrderRepository orderRepository;

    /**
     * Generate a unique order number using UUID
     * Format: CHG-YYYYMMDD-XXXXXXXXXXXX
     * This prevents race conditions when multiple orders are created simultaneously
     */
    @Transactional
    public synchronized String generate() {
        String datePart = LocalDateTime.now().format(DATE_FORMAT);
        String uniquePart;
        String orderNumber;

        // Keep generating until we get a unique order number
        // This handles the extremely rare case of UUID collision
        int maxAttempts = 10;
        int attempts = 0;

        do {
            // Generate 8-character unique identifier from UUID
            uniquePart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            orderNumber = PREFIX + "-" + datePart + "-" + uniquePart;
            attempts++;

            if (attempts >= maxAttempts) {
                // Fallback to timestamp-based unique identifier
                uniquePart = String.valueOf(System.nanoTime()).substring(8);
                orderNumber = PREFIX + "-" + datePart + "-" + uniquePart;
                break;
            }
        } while (orderRepository.findByOrderNumber(orderNumber).isPresent());

        return orderNumber;
    }
}

