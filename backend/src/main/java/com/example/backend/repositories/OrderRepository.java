package com.example.backend.repositories;

import com.example.backend.entities.Order;
import com.example.backend.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByBuyer_IdAndOrderStatusIn(
            Integer buyerId,
            List<OrderStatus> statuses,
            Pageable pageable
    );
    Page<Order> findBySeller_IdAndOrderStatusIn(
            Integer sellerId,
            List<OrderStatus> statuses,
            Pageable pageable
    );
    Page<Order> findBySeller_IdAndOrderStatus(
            Integer sellerId,
            OrderStatus status,
            Pageable pageable
    );
    Page<Order> findBySeller_IdAndViewedBySellerFalseAndOrderStatus(
            Integer sellerId,
            OrderStatus status,
            Pageable pageable
    );
    Optional<Order> findByIdAndSeller_Id(Long orderId, Integer sellerId);
}
