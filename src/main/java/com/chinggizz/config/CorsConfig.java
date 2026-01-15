package com.chinggizz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration to allow frontend access
 * Enhanced for better cross-origin support with both WebMvcConfigurer and CorsConfigurationSource
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Global CORS configuration using WebMvcConfigurer
     * This ensures CORS is applied at the MVC level before security filters
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "http://[::1]:*",
                    "https://*.netlify.app",           // Netlify deployments
                    "https://*.onrender.com",          // Render deployments
                    "https://*.workers.dev",           // Cloudflare Workers
                    "https://chinggizz.com",           // Custom domain (if any)
                    "https://*.chinggizz.com"          // Custom subdomains
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * CORS configuration source for Spring Security
     * This ensures CORS is also applied at the security filter level
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow multiple frontend origins with wildcard port support
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://[::1]:*",
            "https://*.netlify.app",           // Netlify deployments
            "https://*.onrender.com",          // Render deployments
            "https://*.workers.dev",           // Cloudflare Workers
            "https://chinggizz.com",           // Custom domain (if any)
            "https://*.chinggizz.com"          // Custom subdomains
        ));

        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));

        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Expose headers that frontend might need
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

