package com.chinggizz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * HamperBox Data Transfer Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HamperBoxDTO {
    private Long id;
    private String name;
    private String description;
    private String size;
    private BigDecimal price;
    private Integer maxItems;
    private String imageUrl;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Physical dimensions for 3D rendering and validation
    private BigDecimal lengthCm;
    private BigDecimal widthCm;
    private BigDecimal heightCm;

    // Grid configuration for item placement
    private Integer gridRows;
    private Integer gridCols;
}

