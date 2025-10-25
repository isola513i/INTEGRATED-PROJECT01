package com.example.backend.repositories;

import com.example.backend.entities.Cart;
import com.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByBuyerId(Integer buyerId);
    Optional<Cart> findByBuyer(User buyer);



}
