package com.chinggizz.dto;

import com.chinggizz.enums.DeliveryMethod;
import com.chinggizz.enums.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Request DTO for creating an order
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    private String customerPhone;
    
    private String customerEmail;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private LocalDateTime deliveryDate;

    private String specialInstructions;

    // New fields for enhanced order management
    private DeliveryMethod deliveryMethod;

    private OrderType orderType;

    private String city;

    private String state;

    private String pincode;

    @Valid
    private List<OrderItemRequest> orderItems;

    @Valid
    private List<OrderHamperRequest> orderHampers;
}

