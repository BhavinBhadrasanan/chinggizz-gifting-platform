package com.chinggizz.repository;

import com.chinggizz.entity.HamperBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HamperBoxRepository extends JpaRepository<HamperBox, Long> {
    List<HamperBox> findByActiveTrue();
    List<HamperBox> findByActiveTrueOrderByPriceAsc();
}

