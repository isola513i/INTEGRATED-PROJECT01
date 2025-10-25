package com.example.backend.controllers;

import com.example.backend.dtos.OrderDto;
import com.example.backend.services.OrderService;
import com.example.backend.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/itb-mshop")
//@CrossOrigin("*")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/v2/orders")
    public ResponseEntity<List<OrderDto.PlaceOrderResponse>> placeOrder(
            @Valid @RequestBody OrderDto.PlaceOrderRequest req,
            @RequestHeader("X-USER-ID") Long tokenUserId
    ) {
        List<OrderDto.PlaceOrderResponse> responses = orderService.placeOrder(req, tokenUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    // View Buyer Order
    @GetMapping("/v2/users/{id}/orders")
    public ResponseEntity<Page<OrderDto.BuyerOrderSummary>> getBuyerOrders(
            @PathVariable("id") Integer buyerId,
            HttpServletRequest request,
            @PageableDefault(sort = "orderDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Integer tokenUserId = jwtUtils.extractUserId(request);
        if (!buyerId.equals(tokenUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied");
        }
        Page<OrderDto.BuyerOrderSummary> orders = orderService.getOrdersByBuyer(buyerId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/v2/orders/{id}")
    public ResponseEntity<OrderDto.BuyerOrderSummary> getOrderDetail(
            @PathVariable("id") Long orderId,
            HttpServletRequest request
    ) {
        Integer tokenUserId = jwtUtils.extractUserId(request);
        OrderDto.BuyerOrderSummary orderDetail = orderService.getOrderDetail(orderId, tokenUserId);
        return ResponseEntity.ok(orderDetail);
    }

    // View Seller Order
    @GetMapping("/v2/sellers/{sid}/orders")
    public ResponseEntity<Page<OrderDto.SellerOrderSummary>> getSellerOrders(
            @PathVariable("sid") Integer sellerId,
            @RequestParam(required = false, defaultValue = "all") String status,
            @PageableDefault(sort = "orderDate", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletRequest request
    ) {
        Integer tokenUserId = jwtUtils.extractUserId(request);
        Page<OrderDto.SellerOrderSummary> orders = orderService.getOrdersBySeller(
                sellerId, tokenUserId, status, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/v2/sellers/{sid}/orders/{id}")
    public ResponseEntity<OrderDto.SellerOrderSummary> getSellerOrderDetail(
            @PathVariable("sid") Integer sellerId,
            @PathVariable("id") Long orderId,
            HttpServletRequest request
    ) {
        Integer tokenUserId = jwtUtils.extractUserId(request);
        OrderDto.SellerOrderSummary orderDetail = orderService.getSellerOrderDetail(
                sellerId, orderId, tokenUserId);
        return ResponseEntity.ok(orderDetail);
    }
}
