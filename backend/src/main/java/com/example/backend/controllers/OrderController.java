package com.example.backend.controllers;

import com.example.backend.dtos.OrderDto;
import com.example.backend.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/itb-mshop")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/v2/orders")
    public ResponseEntity<OrderDto.PlaceOrderResponse> placeOrder(
            @Valid @RequestBody OrderDto.PlaceOrderRequest req,
            @RequestHeader("X-USER-ID") Long tokenUserId
    ) {
        OrderDto.PlaceOrderResponse response = orderService.placeOrder(req, tokenUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
