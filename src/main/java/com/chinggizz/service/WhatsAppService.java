package com.chinggizz.service;

import com.chinggizz.dto.OrderDTO;
import com.chinggizz.dto.OrderHamperDTO;
import com.chinggizz.dto.OrderItemDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

/**
 * WhatsApp Service for sending order notifications
 * Sends order details to business WhatsApp number
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    @Value("${app.whatsapp.business-number}")
    private String businessNumber;

    private static final String WHATSAPP_API_URL = "https://api.whatsapp.com/send";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    /**
     * Send order details to business WhatsApp
     * @param order Order details to send
     */
    public void sendOrderNotification(OrderDTO order) {
        try {
            String message = buildOrderMessage(order);
            String whatsappUrl = buildWhatsAppUrl(message);
            
            log.info("WhatsApp notification URL generated for order: {}", order.getOrderNumber());
            log.info("WhatsApp URL: {}", whatsappUrl);
            
            // Note: In production, you would integrate with WhatsApp Business API
            // For now, we log the URL that can be used to send the message
            // You can also use a third-party service like Twilio, MessageBird, etc.
            
        } catch (Exception e) {
            log.error("Failed to generate WhatsApp notification for order: {}", order.getOrderNumber(), e);
        }
    }

    /**
     * Build formatted order message for WhatsApp
     */
    private String buildOrderMessage(OrderDTO order) {
        StringBuilder message = new StringBuilder();
        
        message.append("🎁 *NEW ORDER RECEIVED* 🎁\n\n");
        message.append("━━━━━━━━━━━━━━━━━━━━\n\n");
        
        // Order Details
        message.append("📋 *Order Details*\n");
        message.append("Order Number: *").append(order.getOrderNumber()).append("*\n");
        message.append("Order Type: *").append(formatOrderType(order.getOrderType())).append("*\n");
        message.append("Status: *").append(order.getStatus()).append("*\n");
        message.append("Total Amount: *₹").append(order.getTotalAmount()).append("*\n\n");
        
        // Customer Details
        message.append("👤 *Customer Information*\n");
        message.append("Name: ").append(order.getCustomerName()).append("\n");
        message.append("Phone: ").append(order.getCustomerPhone()).append("\n");
        if (order.getCustomerEmail() != null && !order.getCustomerEmail().isEmpty()) {
            message.append("Email: ").append(order.getCustomerEmail()).append("\n");
        }
        message.append("\n");
        
        // Delivery Details
        message.append("📦 *Delivery Information*\n");
        message.append("Method: *").append(formatDeliveryMethod(order.getDeliveryMethod())).append("*\n");
        message.append("Address: ").append(order.getDeliveryAddress()).append("\n");
        if (order.getCity() != null) {
            message.append("City: ").append(order.getCity()).append("\n");
        }
        if (order.getState() != null) {
            message.append("State: ").append(order.getState()).append("\n");
        }
        if (order.getPincode() != null) {
            message.append("Pincode: ").append(order.getPincode()).append("\n");
        }
        if (order.getDeliveryDate() != null) {
            message.append("Delivery Date: ").append(order.getDeliveryDate().format(DATE_FORMATTER)).append("\n");
        }
        message.append("\n");
        
        // Order Items
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            message.append("🛍️ *Order Items*\n");
            for (OrderItemDTO item : order.getOrderItems()) {
                message.append("• ").append(item.getProductName())
                       .append(" x").append(item.getQuantity())
                       .append(" - ₹").append(item.getTotalPrice()).append("\n");
            }
            message.append("\n");
        }
        
        // Hamper Items
        if (order.getOrderHampers() != null && !order.getOrderHampers().isEmpty()) {
            message.append("🎁 *Custom Hampers*\n");
            for (OrderHamperDTO hamper : order.getOrderHampers()) {
                message.append("• ").append(hamper.getHamperBoxName())
                       .append(" - ₹").append(hamper.getTotalPrice());
                if (hamper.getWithArrangement()) {
                    message.append(" (With Arrangement)");
                }
                message.append("\n");
            }
            message.append("\n");
        }
        
        // Special Instructions
        if (order.getSpecialInstructions() != null && !order.getSpecialInstructions().isEmpty()) {
            message.append("📝 *Special Instructions*\n");
            message.append(order.getSpecialInstructions()).append("\n\n");
        }
        
        message.append("━━━━━━━━━━━━━━━━━━━━\n");
        message.append("Order placed on: ").append(order.getCreatedAt().format(DATE_FORMATTER)).append("\n");
        message.append("\n_This is an automated notification from Chinggizz_");
        
        return message.toString();
    }

    /**
     * Build WhatsApp URL with encoded message
     */
    private String buildWhatsAppUrl(String message) {
        String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return WHATSAPP_API_URL + "?phone=" + businessNumber + "&text=" + encodedMessage;
    }

    private String formatOrderType(com.chinggizz.enums.OrderType orderType) {
        if (orderType == null) return "Direct Purchase";
        return switch (orderType) {
            case DIRECT_PURCHASE -> "Direct Purchase";
            case HAMPER_ARRANGEMENT -> "Custom Hamper Arrangement";
        };
    }

    private String formatDeliveryMethod(com.chinggizz.enums.DeliveryMethod deliveryMethod) {
        if (deliveryMethod == null) return "Direct Delivery";
        return switch (deliveryMethod) {
            case DIRECT_DELIVERY -> "Direct Delivery";
            case COURIER_DELIVERY -> "Courier Delivery";
        };
    }
}

