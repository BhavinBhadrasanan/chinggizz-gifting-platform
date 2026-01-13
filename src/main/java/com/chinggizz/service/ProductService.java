package com.chinggizz.service;

import com.chinggizz.dto.ProductDTO;
import com.chinggizz.entity.Category;
import com.chinggizz.entity.Product;
import com.chinggizz.enums.ProductType;
import com.chinggizz.exception.ResourceNotFoundException;
import com.chinggizz.repository.CategoryRepository;
import com.chinggizz.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Product operations
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    @Cacheable(value = "products", unless = "#result.isEmpty()")
    public List<ProductDTO> getAllActiveProducts() {
        return productRepository.findByActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return convertToDTO(product);
    }

    @Cacheable(value = "productsByCategory", key = "#categoryId", unless = "#result.isEmpty()")
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "productsByType", key = "#productType", unless = "#result.isEmpty()")
    public List<ProductDTO> getProductsByType(ProductType productType) {
        return productRepository.findByProductTypeAndActiveTrue(productType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getCustomizableProducts() {
        return productRepository.findByIsCustomizableTrueAndActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    @CacheEvict(value = {"products", "productsByCategory", "productsByType"}, allEntries = true)
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = null;
        if (productDTO.getCategoryId() != null) {
            category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDTO.getCategoryId()));
        }
        
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .productType(productDTO.getProductType())
                .imageUrl(productDTO.getImageUrl())
                .isCustomizable(productDTO.getIsCustomizable())
                .customizationCharge(productDTO.getCustomizationCharge())
                .stockQuantity(productDTO.getStockQuantity())
                .customizationOptions(productDTO.getCustomizationOptions())
                .category(category)
                .active(true)
                .widthCm(productDTO.getWidthCm())
                .heightCm(productDTO.getHeightCm())
                .depthCm(productDTO.getDepthCm())
                .build();

        Product saved = productRepository.save(product);
        return convertToDTO(saved);
    }
    
    @Transactional
    @CacheEvict(value = {"products", "productsByCategory", "productsByType"}, allEntries = true)
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        
        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDTO.getCategoryId()));
            product.setCategory(category);
        }
        
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setProductType(productDTO.getProductType());
        product.setImageUrl(productDTO.getImageUrl());
        product.setIsCustomizable(productDTO.getIsCustomizable());
        product.setCustomizationCharge(productDTO.getCustomizationCharge());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setCustomizationOptions(productDTO.getCustomizationOptions());
        product.setActive(productDTO.getActive());

        // Update dimensions for 3D hamper simulation
        product.setWidthCm(productDTO.getWidthCm());
        product.setHeightCm(productDTO.getHeightCm());
        product.setDepthCm(productDTO.getDepthCm());

        Product updated = productRepository.save(product);
        return convertToDTO(updated);
    }
    
    @Transactional
    @CacheEvict(value = {"products", "productsByCategory", "productsByType"}, allEntries = true)
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }
    
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .productType(product.getProductType())
                .imageUrl(product.getImageUrl())
                .isCustomizable(product.getIsCustomizable())
                .customizationCharge(product.getCustomizationCharge())
                .stockQuantity(product.getStockQuantity())
                .active(product.getActive())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .customizationOptions(product.getCustomizationOptions())
                .widthCm(product.getWidthCm())
                .heightCm(product.getHeightCm())
                .depthCm(product.getDepthCm())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}

