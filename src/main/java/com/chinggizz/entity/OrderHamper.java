package com.chinggizz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * OrderHamper Entity - Custom hampers in an order
 */
@Entity
@Table(name = "order_hampers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderHamper extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hamper_box_id", nullable = false)
    private HamperBox hamperBox;
    
    @Column(name = "hamper_box_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal hamperBoxPrice;
    
    @Column(name = "items_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal itemsTotal;
    
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "with_arrangement", nullable = false)
    private Boolean withArrangement = false;
    
    @Column(name = "arrangement_charge", precision = 10, scale = 2)
    private BigDecimal arrangementCharge = BigDecimal.ZERO;
    
    // JSON field for hamper items and arrangement layout
    @Column(name = "hamper_data", columnDefinition = "TEXT", nullable = false)
    private String hamperData;
}

