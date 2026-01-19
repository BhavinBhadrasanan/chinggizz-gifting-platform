package com.chinggizz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for order hamper
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHamperRequest {
    
    @NotNull(message = "Hamper box ID is required")
    private Long hamperBoxId;
    
    @NotNull(message = "With arrangement flag is required")
    private Boolean withArrangement;

    @NotBlank(message = "Hamper data is required")
    private String hamperData;

    // Custom name for the hamper
    private String hamperName;

    // Base64 encoded screenshot of the 3D hamper arrangement
    private String screenshot;
}

