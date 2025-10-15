package com.example.backend.controllers;

import com.example.backend.dtos.CartItemDto;
import com.example.backend.entities.Cart;
import com.example.backend.services.CartService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/itb-mshop/v1/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ListMapper listMapper;

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemDto>> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCartItemsByUser(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Void> addToCart(
            @PathVariable Integer userId,
            @RequestParam Integer saleItemId,
            @RequestParam(defaultValue="1") Integer quantity
    ) {
        cartService.addToCart(userId, saleItemId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Void> setQuantity(
            @PathVariable Integer userId,
            @RequestParam Integer saleItemId,
            @RequestParam int quantity) {
        cartService.setQuantity(userId, saleItemId, quantity);

        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
