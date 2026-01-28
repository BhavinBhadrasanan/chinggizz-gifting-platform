package com.chinggizz.entity;

import com.chinggizz.enums.ProductType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Product Entity - All products including customised items, edibles, and hampers
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false, length = 50)
    private ProductType productType;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "is_customizable", nullable = false)
    private Boolean isCustomizable = false;
    
    @Column(name = "customization_charge", precision = 10, scale = 2)
    private BigDecimal customizationCharge = BigDecimal.ZERO;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // JSON field for customization options (stored as TEXT)
    @Column(name = "customization_options", columnDefinition = "TEXT")
    private String customizationOptions;

    // JSON field for product specifications (stored as TEXT)
    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    // Product dimensions in centimeters
    @Column(name = "width_cm", precision = 10, scale = 2)
    private BigDecimal widthCm;

    @Column(name = "height_cm", precision = 10, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "depth_cm", precision = 10, scale = 2)
    private BigDecimal depthCm;
}

