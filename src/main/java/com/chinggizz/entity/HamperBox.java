package com.chinggizz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * HamperBox Entity - Empty hamper boxes for custom hampers
 */
@Entity
@Table(name = "hamper_boxes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HamperBox extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false, length = 50)
    private String size; // SMALL, MEDIUM, LARGE, EXTRA_LARGE
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "max_items")
    private Integer maxItems;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean active = true;

    // Physical dimensions for 3D rendering and validation
    @Column(name = "length_cm", precision = 5, scale = 2)
    private BigDecimal lengthCm;

    @Column(name = "width_cm", precision = 5, scale = 2)
    private BigDecimal widthCm;

    @Column(name = "height_cm", precision = 5, scale = 2)
    private BigDecimal heightCm;

    // Grid configuration for item placement
    @Column(name = "grid_rows")
    private Integer gridRows;

    @Column(name = "grid_cols")
    private Integer gridCols;
}

