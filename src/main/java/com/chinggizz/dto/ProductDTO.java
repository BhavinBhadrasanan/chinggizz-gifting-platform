package com.chinggizz.dto;

import com.chinggizz.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Product Data Transfer Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private ProductType productType;
    private String imageUrl;
    private Boolean isCustomizable;
    private BigDecimal customizationCharge;
    private Integer stockQuantity;
    private Boolean active;
    private Long categoryId;
    private String categoryName;
    private String customizationOptions;
    private BigDecimal widthCm;
    private BigDecimal heightCm;
    private BigDecimal depthCm;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

