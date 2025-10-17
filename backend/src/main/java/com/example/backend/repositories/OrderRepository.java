package com.example.backend.repositories;

import com.example.backend.entities.Order;
import com.example.backend.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByBuyer_IdAndOrderStatusIn(
            Integer buyerId,
            List<OrderStatus> statuses,
            Pageable pageable
    );
}
