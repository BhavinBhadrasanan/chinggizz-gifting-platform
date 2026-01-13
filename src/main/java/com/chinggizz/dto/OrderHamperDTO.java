package com.chinggizz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * OrderHamper Data Transfer Object
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHamperDTO {
    private Long id;
    private Long hamperBoxId;
    private String hamperBoxName;
    private BigDecimal hamperBoxPrice;
    private BigDecimal itemsTotal;
    private BigDecimal totalPrice;
    private Boolean withArrangement;
    private BigDecimal arrangementCharge;
    private String hamperData;
}

