package com.chinggizz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Application Class for Chinggizz - Customised Gifts & Surprise Platform
 * 
 * @author Chinggizz Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class ChinggizzApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChinggizzApplication.class, args);
        System.out.println("\n" +
                "╔═══════════════════════════════════════════════════════════╗\n" +
                "║                                                           ║\n" +
                "║   🎁  CHINGGIZZ - Customised Gifts Platform  🎁          ║\n" +
                "║                                                           ║\n" +
                "║   Application Started Successfully!                       ║\n" +
                "║   API Documentation: http://localhost:8080/api            ║\n" +
                "║   Database: Supabase PostgreSQL (Cloud)                   ║\n" +
                "║                                                           ║\n" +
                "╚═══════════════════════════════════════════════════════════╝\n");
    }
}

