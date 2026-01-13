package com.chinggizz.repository;

import com.chinggizz.entity.Product;
import com.chinggizz.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByProductTypeAndActiveTrue(ProductType productType);
    List<Product> findByIsCustomizableTrueAndActiveTrue();
}

