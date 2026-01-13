package com.chinggizz.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Admin Entity - Admin users for managing the platform
 */
@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String username;
    
    @Column(nullable = false, length = 255)
    private String password; // BCrypt encoded

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;
    
    @Column(length = 200)
    private String email;
    
    @Column(nullable = false)
    private Boolean active = true;
}

