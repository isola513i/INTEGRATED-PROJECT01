package com.example.backend.services;

import com.example.backend.dtos.CartDetailResponse;
import com.example.backend.dtos.CartItemDto;
import com.example.backend.entities.Cart;
import com.example.backend.entities.CartItem;
import com.example.backend.entities.SaleItem;
import com.example.backend.entities.User;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.SaleItemRepository;
import com.example.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private SaleItemRepository saleItemRepository;
    @Autowired
    private UserRepository userRepository;


    @Transactional
    public Cart addToCart(Integer userId, Integer saleItemId, int quantity) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByBuyerId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setBuyer(buyer);
                    return cartRepository.save(newCart);
                });

        SaleItem saleItem = saleItemRepository.findById(saleItemId)
                .orElseThrow(() -> new RuntimeException("SaleItem not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndSaleItem(cart, saleItem);

        CartItem cartItem;
        if (existingItemOpt.isPresent()) {
            // ถ้ามีอยู่แล้ว ให้เพิ่มจำนวน
            cartItem = existingItemOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);

            cartItem.setSaleItem(saleItem);
            cartItem.setQuantity(quantity);
            cart.getItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart setQuantity(Integer userId, Integer saleItemId, Integer quantity) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByBuyer(buyer)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        SaleItem saleItem = saleItemRepository.findById(saleItemId)
                .orElseThrow(() -> new RuntimeException("SaleItem not found"));

        CartItem cartItem = cartItemRepository.findByCartAndSaleItem(cart, saleItem)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            System.out.println(cartItem);
            System.out.println(cartItem.getQuantity());
            System.out.println(cartItem.getSaleItem().getId());
        }

        return cartRepository.findByBuyer(buyer).get();
    }

    @Transactional
    public List<CartItemDto> getCartItemsByUser(Integer userId) {
        User buyer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByBuyerId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setBuyer(buyer);
                    return cartRepository.save(newCart);
                });

        List<CartItem> toDelete = new ArrayList<>();
        List<CartItemDto> dtos = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            SaleItem sale = item.getSaleItem();
            int available = sale.getQuantity();
            int cartQty = item.getQuantity();

            // ✅ ถ้าสินค้าหมด (available == 0) → ลบ item นี้
            if (available == 0) {
                toDelete.add(item);
                continue; // ข้ามไม่ใส่ใน dto list
            }

            // ✅ อัปเดต quantity ถ้ามากกว่า stock
            if (cartQty > available) {
                item.setQuantity(available);
                cartItemRepository.save(item);
            }

            CartItemDto dto = new CartItemDto();
            dto.setId(sale.getId()); // ใช้ id ของ CartItem นะ
            dto.setModel(sale.getModel());
            dto.setBrandName(sale.getBrand() != null ? sale.getBrand().getName() : null);
            dto.setDescription(sale.getDescription());
            dto.setPrice(sale.getPrice());
            dto.setRamGb(sale.getRamGb());
            dto.setStorageGb(sale.getStorageGb());
            dto.setScreenSizeInch(sale.getScreenSizeInch());
            dto.setColor(sale.getColor());
            dto.setSellerId(sale.getSeller().getId());
            dto.setSellerUsername(sale.getSeller().getFullName());
            dto.setQuantity(Math.min(cartQty, available));

            dtos.add(dto);
        }

        // ✅ ลบทั้งหมดรวดเดียวหลัง loop (ปลอดภัย ไม่ชน constraint)
        if (!toDelete.isEmpty()) {
            cartItemRepository.deleteAllInBatch(toDelete);
        }

        return dtos;
    }

    public void updateCartDetail(Integer userId, String shippingAddress, String note) {
        Cart cart = cartRepository.findByBuyerId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for userId: " + userId));

        cart.setShippingAddress(shippingAddress);
        cart.setNote(note);
        cartRepository.save(cart);
    }

    public CartDetailResponse getCartDetail(Integer userId) {
        Cart cart = cartRepository.findByBuyerId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for userId: " + userId));

        CartDetailResponse dto = new CartDetailResponse();
        dto.setShippingAddress(cart.getShippingAddress());
        dto.setNote(cart.getNote());
        return dto;
    }

}
