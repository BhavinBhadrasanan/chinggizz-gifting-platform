package com.chinggizz.exception;

import java.math.BigDecimal;

/**
 * Exception thrown when client-provided price doesn't match server price
 */
public class PriceMismatchException extends RuntimeException {
    
    private final Long productId;
    private final String productName;
    private final BigDecimal clientPrice;
    private final BigDecimal serverPrice;
    
    public PriceMismatchException(Long productId, String productName, BigDecimal clientPrice, BigDecimal serverPrice) {
        super(String.format("Price mismatch for product '%s' (ID: %d). Client price: %s, Server price: %s", 
            productName, productId, clientPrice, serverPrice));
        this.productId = productId;
        this.productName = productName;
        this.clientPrice = clientPrice;
        this.serverPrice = serverPrice;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public BigDecimal getClientPrice() {
        return clientPrice;
    }
    
    public BigDecimal getServerPrice() {
        return serverPrice;
    }
}

