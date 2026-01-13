package com.chinggizz.enums;

/**
 * Order Status Enumeration
 */
public enum OrderStatus {
    NEW,            // Order just placed
    CONFIRMED,      // Order confirmed by admin
    IN_PROGRESS,    // Order being prepared
    DELIVERED,      // Order delivered
    CANCELLED       // Order cancelled
}

