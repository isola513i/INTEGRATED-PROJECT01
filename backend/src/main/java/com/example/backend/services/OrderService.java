package com.example.backend.services;

import com.example.backend.dtos.OrderDto;
import com.example.backend.entities.*;
import com.example.backend.enums.OrderStatus;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.exceptions.QuantityNotEnoughException;
import com.example.backend.exceptions.SellerNotMatchInTokenException;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.OrderRepository;
import com.example.backend.repositories.SaleItemRepository;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private SaleItemRepository saleItemRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private CartRepository cartRepo;
    @Autowired
    private CartItemRepository cartItemRepo;

    @Transactional
    public List<OrderDto.PlaceOrderResponse> placeOrder(OrderDto.PlaceOrderRequest req, Long tokenUserId) {
        if (!Objects.equals(tokenUserId, req.getBuyerId())) {
            throw new SellerNotMatchInTokenException("Buyer ID in request does not match token.");
        }
        User buyer = userRepo.findById(req.getBuyerId().intValue())
                .orElseThrow(() -> new ItemNotFoundException("Buyer not found with id: " + req.getBuyerId()));
        List<OrderDto.PlaceOrderResponse> responses = new ArrayList<>();
        List<Integer> allSelectedSaleItemIds = new ArrayList<>();
        for (OrderDto.SellerOrderGroup group : req.getSellerGroups()) {
            User seller = userRepo.findById(group.getSellerId().intValue())
                    .orElseThrow(() -> new ItemNotFoundException("Seller not found with id: " + group.getSellerId()));
            Order order = new Order();
            order.setBuyer(buyer);
            order.setSeller(seller);
            order.setShippingAddress(req.getShippingAddress());
            order.setOrderNote(req.getOrderNote());
            order.setOrderStatus(OrderStatus.COMPLETED);
            order.setTotalPrice(BigDecimal.ZERO);
            for (OrderDto.SelectedCartItem itemRequest : group.getItems()) {
                SaleItem saleItem = saleItemRepo.findById(itemRequest.getSaleItemId().intValue())
                        .orElseThrow(() -> new ItemNotFoundException("Sale item not found with id: " + itemRequest.getSaleItemId()));
                if (!Objects.equals(saleItem.getSeller().getId(), seller.getId())) {
                    throw new IllegalArgumentException("Item ID " + saleItem.getId() + " is not owned by seller ID " + seller.getId());
                }
                if (saleItem.getQuantity() < itemRequest.getQuantity()) {
                    throw new QuantityNotEnoughException("Not enough stock for item: " + saleItem.getModel());
                }
                int updatedRows = saleItemRepo.deductStock(saleItem.getId(), itemRequest.getQuantity());
                if (updatedRows == 0) {
                    throw new QuantityNotEnoughException("Failed to deduct stock for item: " + saleItem.getModel());
                }
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setSaleItem(saleItem);
                orderItem.setPrice(BigDecimal.valueOf(saleItem.getPrice()));
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setDescription(saleItem.getModel());
                order.getItems().add(orderItem);
                order.setTotalPrice(
                        order.getTotalPrice().add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())))
                );

                allSelectedSaleItemIds.add(saleItem.getId());
            }
            Order savedOrder = orderRepo.save(order);
            responses.add(toPlaceOrderResponseDto(savedOrder));
        }
        cartRepo.findByBuyerId(buyer.getId())
                .ifPresent(cart -> {
                    if (!allSelectedSaleItemIds.isEmpty()) {
                        cartItemRepo.deleteSelected(cart.getId(), allSelectedSaleItemIds);
                    }
                });
        return responses;
    }

    private OrderDto.PlaceOrderResponse toPlaceOrderResponseDto(Order order) {
        OrderDto.PlaceOrderResponse response = new OrderDto.PlaceOrderResponse();

        response.setId(String.valueOf(order.getId()));
        response.setBuyerId(String.valueOf(order.getBuyer().getId()));
        response.setShippingAddress(order.getShippingAddress());
        response.setOrderNote(order.getOrderNote());
        response.setOrderStatus(order.getOrderStatus().name());
        if (order.getOrderDate() != null) {
            response.setOrderDate(order.getOrderDate().toString());
        }

        OrderDto.PlaceOrderResponse.SellerDto sellerDto = new OrderDto.PlaceOrderResponse.SellerDto();
        User sellerEntity = order.getSeller();
        sellerDto.setId(String.valueOf(sellerEntity.getId()));
        sellerDto.setEmail(sellerEntity.getEmail());
        sellerDto.setFullName(sellerEntity.getFullName());
        sellerDto.setUserType(sellerEntity.getUserType());
        sellerDto.setNickName(sellerEntity.getNickName());
        response.setSeller(sellerDto);
        response.setOrderItems(mapOrderItemsToDto(order.getItems()));
        return response;
    }

    private List<OrderDto.PlaceOrderResponse.OrderItemDto> mapOrderItemsToDto(List<OrderItem> items) {
        List<OrderDto.PlaceOrderResponse.OrderItemDto> orderItemDto = new ArrayList<>();
        int itemNo = 1;
        for (OrderItem itemEntity : items) {
            OrderDto.PlaceOrderResponse.OrderItemDto itemDto = new OrderDto.PlaceOrderResponse.OrderItemDto();
            itemDto.setNo(itemNo++);
            itemDto.setItemId(Long.valueOf(itemEntity.getSaleItem().getId()));
            itemDto.setPrice(itemEntity.getPrice().intValue());
            itemDto.setQuantity(itemEntity.getQuantity());
            itemDto.setDescription(itemEntity.getDescription());
            orderItemDto.add(itemDto);
        }
        return orderItemDto;
    }

    @Transactional(readOnly = true)
    public Page<OrderDto.BuyerOrderSummary> getOrdersByBuyer(Integer buyerId, Pageable pageable) {
        Page<Order> orderPage = orderRepo.findByBuyer_IdAndOrderStatusIn(
                buyerId,
                List.of(OrderStatus.COMPLETED),
                pageable
        );
        return orderPage.map(this::toBuyerOrderSummaryDto);
    }

    private OrderDto.BuyerOrderSummary toBuyerOrderSummaryDto(Order order) {
        OrderDto.BuyerOrderSummary summary = new OrderDto.BuyerOrderSummary();
        summary.setId(order.getId().intValue());
        summary.setOrderNo(String.valueOf(order.getId()));
        summary.setOrderDate(order.getOrderDate());
        summary.setPaymentDate(order.getPaymentDate());
        summary.setTotalAmount(order.getTotalPrice().intValue());
        summary.setOrderStatus(order.getOrderStatus().name());
        summary.setShippingAddress(order.getShippingAddress());
        summary.setOrderNote(order.getOrderNote());

        OrderDto.BuyerOrderSummary.SellerBrief sellerBrief = new OrderDto.BuyerOrderSummary.SellerBrief();
        sellerBrief.setId(order.getSeller().getId());
        sellerBrief.setUserName(order.getSeller().getNickName());
        summary.setSeller(sellerBrief);

        List<OrderDto.BuyerOrderSummary.BuyerOrderItem> buyerOrderItemList = new ArrayList<>();
        int itemNo = 1;
        for (OrderItem itemEntity : order.getItems()) {
            OrderDto.BuyerOrderSummary.BuyerOrderItem itemDto = new OrderDto.BuyerOrderSummary.BuyerOrderItem();
            SaleItem saleItem = itemEntity.getSaleItem();

            itemDto.setNo(itemNo++);
            itemDto.setSaleItemId(saleItem.getId().longValue());
            itemDto.setPrice(itemEntity.getPrice().intValue());
            itemDto.setQuantity(itemEntity.getQuantity());

            String description = String.format("%s %s, Color: %s, Storage: %d GB",
                    saleItem.getBrand().getName(),
                    saleItem.getModel(),
                    saleItem.getColor(),
                    saleItem.getStorageGb());
            itemDto.setDescription(description);

            if (saleItem.getPictures() != null && !saleItem.getPictures().isEmpty()) {
                SaleItemPicture firstPicture = saleItem.getPictures().get(0);
                String imageUrl = String.format("/itb-mshop/v2/sale-items/%d/images/%s",
                        saleItem.getId(), firstPicture.getFileName());
                itemDto.setImageUrl(imageUrl);
            }
            buyerOrderItemList.add(itemDto);
        }
        summary.setOrderItems(buyerOrderItemList);
        return summary;
    }

    @Transactional(readOnly = true)
    public OrderDto.BuyerOrderSummary getOrderDetail(Long orderId, Integer tokenUserId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ItemNotFoundException("Order not found with id: " + orderId));
        if (!order.getBuyer().getId().equals(tokenUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You are not the owner of this order.");
        }
        return toBuyerOrderSummaryDto(order);
    }
}