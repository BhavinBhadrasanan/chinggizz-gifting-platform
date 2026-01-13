package com.chinggizz.repository;

import com.chinggizz.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrue();
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
    Optional<Category> findByName(String name);
}

