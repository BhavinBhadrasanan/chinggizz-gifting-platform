package com.chinggizz.repository;

import com.chinggizz.entity.Order;
import com.chinggizz.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCustomerPhone(String customerPhone);
    List<Order> findAllByOrderByCreatedAtDesc();
}

