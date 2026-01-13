package com.chinggizz.dto;

import com.chinggizz.enums.DeliveryMethod;
import com.chinggizz.enums.OrderStatus;
import com.chinggizz.enums.OrderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order Data Transfer Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String deliveryAddress;
    private LocalDateTime deliveryDate;
    private String specialInstructions;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private DeliveryMethod deliveryMethod;
    private OrderType orderType;
    private String city;
    private String state;
    private String pincode;
    private List<OrderItemDTO> orderItems;
    private List<OrderHamperDTO> orderHampers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

