package com.chinggizz.controller;

import com.chinggizz.dto.ProductDTO;
import com.chinggizz.enums.ProductType;
import com.chinggizz.service.FileStorageService;
import com.chinggizz.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @Value("${server.port:8080}")
    private String serverPort;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllActiveProducts() {
        List<ProductDTO> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/type/{productType}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable ProductType productType) {
        List<ProductDTO> products = productService.getProductsByType(productType);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/customizable")
    public ResponseEntity<List<ProductDTO>> getCustomizableProducts() {
        List<ProductDTO> products = productService.getCustomizableProducts();
        return ResponseEntity.ok(products);
    }
    
    // Admin endpoints
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO created = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO updated = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload product image
     * Returns the URL to access the uploaded image
     */
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadProductImage(@RequestParam("image") MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Please select a file to upload");
            return ResponseEntity.badRequest().body(error);
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Only image files are allowed");
            return ResponseEntity.badRequest().body(error);
        }

        // Validate file size (5MB max)
        if (file.getSize() > 5 * 1024 * 1024) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "File size must be less than 5MB");
            return ResponseEntity.badRequest().body(error);
        }

        // Store file
        String fileName = fileStorageService.storeFile(file);

        // Build file URL
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/products/images/")
                .path(fileName)
                .toUriString();

        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", fileDownloadUri);
        response.put("fileName", fileName);

        return ResponseEntity.ok(response);
    }
}

