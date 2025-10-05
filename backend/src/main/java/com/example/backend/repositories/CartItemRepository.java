package com.example.backend.repositories;

import com.example.backend.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Modifying
    @Query("delete from CartItem ci where ci.cart.id = :cartId and ci.saleItem.id in :saleItemIds")
    void deleteSelected(@Param("cartId") Long cartId, @Param("saleItemIds") List<Integer> saleItemIds);
}
