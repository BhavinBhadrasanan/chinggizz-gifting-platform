package com.chinggizz.exception;

/**
 * Exception thrown when a product is out of stock
 */
public class OutOfStockException extends RuntimeException {
    
    private final Long productId;
    private final String productName;
    private final Integer requestedQuantity;
    private final Integer availableQuantity;
    
    public OutOfStockException(Long productId, String productName, Integer requestedQuantity, Integer availableQuantity) {
        super(String.format("Product '%s' (ID: %d) is out of stock. Requested: %d, Available: %d", 
            productName, productId, requestedQuantity, availableQuantity));
        this.productId = productId;
        this.productName = productName;
        this.requestedQuantity = requestedQuantity;
        this.availableQuantity = availableQuantity;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public Integer getRequestedQuantity() {
        return requestedQuantity;
    }
    
    public Integer getAvailableQuantity() {
        return availableQuantity;
    }
}

