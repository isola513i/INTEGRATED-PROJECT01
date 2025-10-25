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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

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
        List<Integer> successfullyOrderedSaleItemIds = new ArrayList<>();

        for (OrderDto.SellerOrderGroup group : req.getSellerGroups()) {
            User seller = userRepo.findById(group.getSellerId().intValue())
                    .orElseThrow(() -> new ItemNotFoundException("Seller not found with id: " + group.getSellerId()));

            boolean hasInsufficientStock = false;
            String insufficientItemModel = null;
            Map<Long, SaleItem> fetchedSaleItems = new HashMap<>();

            log.info("Checking stock for seller {}", seller.getId());
            for (OrderDto.SelectedCartItem itemRequest : group.getItems()) {
                SaleItem saleItem = fetchedSaleItems.computeIfAbsent(itemRequest.getSaleItemId(),
                        id -> saleItemRepo.findById(id.intValue())
                                .orElseThrow(() -> new ItemNotFoundException("Sale item not found with id: " + id))
                );

                if (!Objects.equals(saleItem.getSeller().getId(), seller.getId())) {
                    log.warn("Item ID {} does not belong to seller ID {}. Skipping group.", saleItem.getId(), seller.getId());
                    throw new IllegalArgumentException("Item ID " + saleItem.getId() + " is not owned by seller ID " + seller.getId());
                }

                if (saleItem.getQuantity() < itemRequest.getQuantity()) {
                    hasInsufficientStock = true;
                    insufficientItemModel = saleItem.getModel();
                    log.warn("Insufficient stock for item: {} (ID: {}). Required: {}, Available: {}. Canceling order for seller {}.",
                            saleItem.getModel(), saleItem.getId(), itemRequest.getQuantity(), saleItem.getQuantity(), seller.getId());
                    break;
                }
            }

            Order order = new Order();
            order.setBuyer(buyer);
            order.setSeller(seller);
            order.setShippingAddress(req.getShippingAddress());
            order.setOrderNote(req.getOrderNote());
            order.setTotalPrice(BigDecimal.ZERO);

            if (hasInsufficientStock) {
                order.setOrderStatus(OrderStatus.CANCELED);
                log.info("Order for seller {} is being canceled due to insufficient stock for item: {}", seller.getId(), insufficientItemModel);

                for (OrderDto.SelectedCartItem itemRequest : group.getItems()) {
                    SaleItem saleItem = fetchedSaleItems.get(itemRequest.getSaleItemId());
                    if (saleItem == null) continue;

                    OrderItem orderItem = createOrderItemEntity(order, saleItem, itemRequest.getQuantity());
                    order.getItems().add(orderItem);
                    // order.setTotalPrice(order.getTotalPrice().add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()))));
                }
            } else {
                order.setOrderStatus(OrderStatus.COMPLETED);
                log.info("Stock sufficient for seller {}. Proceeding with order.", seller.getId());

                for (OrderDto.SelectedCartItem itemRequest : group.getItems()) {
                    SaleItem saleItem = fetchedSaleItems.get(itemRequest.getSaleItemId());
                    if (saleItem == null) continue;
                    int updatedRows = saleItemRepo.deductStock(saleItem.getId(), itemRequest.getQuantity());
                    if (updatedRows == 0) {
                        log.error("Failed to deduct stock for item {} (ID: {}) unexpectedly. Throwing exception.", saleItem.getModel(), saleItem.getId());
                        throw new QuantityNotEnoughException("Failed to deduct stock for item: " + saleItem.getModel() + " (Possibly due to concurrent update)");
                    }

                    OrderItem orderItem = createOrderItemEntity(order, saleItem, itemRequest.getQuantity());
                    order.getItems().add(orderItem);

                    order.setTotalPrice(
                            order.getTotalPrice().add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())))
                    );

                    successfullyOrderedSaleItemIds.add(saleItem.getId());
                }
            }

            Order savedOrder = orderRepo.save(order);
            log.info("Saved order ID {} with status {}", savedOrder.getId(), savedOrder.getOrderStatus());
            responses.add(toPlaceOrderResponseDto(savedOrder));
        }

        if (!successfullyOrderedSaleItemIds.isEmpty()) {
            cartRepo.findByBuyerId(buyer.getId())
                    .ifPresent(cart -> {
                        log.info("Deleting {} successfully ordered items from cart ID {}", successfullyOrderedSaleItemIds.size(), cart.getId());
                        cartItemRepo.deleteSelected(cart.getId(), successfullyOrderedSaleItemIds);
                    });
        } else {
            log.info("No items were successfully ordered, skipping cart deletion.");
        }

        return responses;
    }

    private OrderItem createOrderItemEntity(Order order, SaleItem saleItem, int quantity) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setSaleItem(saleItem);
        orderItem.setPrice(BigDecimal.valueOf(saleItem.getPrice()));
        orderItem.setQuantity(quantity);
        orderItem.setDescription(saleItem.getModel());
        return orderItem;
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
                List.of(OrderStatus.COMPLETED, OrderStatus.CANCELED),
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

    @Transactional(readOnly = true)
    public Page<OrderDto.SellerOrderSummary> getOrdersBySeller(
            Integer sellerId,
            Integer tokenUserId,
            String statusFilter, // "new", "canceled", "all"
            Pageable pageable
    ) {

        if (!Objects.equals(sellerId, tokenUserId)) {
            log.warn("Forbidden access attempt: Token User ID {} tried to access Seller ID {}", tokenUserId, sellerId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID in access token not matched with resource ID");
        }

        userRepo.findById(sellerId)
                .orElseThrow(() -> new ItemNotFoundException("Seller user not found with id: " + sellerId));

        Page<Order> orderPage;
        if ("new".equalsIgnoreCase(statusFilter)) {
            log.info("Fetching new orders for seller {}", sellerId);
            orderPage = orderRepo.findBySeller_IdAndViewedBySellerFalseAndOrderStatus(
                    sellerId, OrderStatus.COMPLETED, pageable);
        } else if ("canceled".equalsIgnoreCase(statusFilter)) {
            log.info("Fetching canceled orders for seller {}", sellerId);
            orderPage = orderRepo.findBySeller_IdAndOrderStatus(
                    sellerId, OrderStatus.CANCELED, pageable);
        } else {
            log.info("Fetching all completed orders for seller {}", sellerId);
            orderPage = orderRepo.findBySeller_IdAndOrderStatusIn(
                    sellerId, List.of(OrderStatus.COMPLETED), pageable);
        }
        return orderPage.map(this::toSellerOrderSummaryDto);
    }

    @Transactional
    public OrderDto.SellerOrderSummary getSellerOrderDetail(
            Integer sellerId,
            Long orderId,
            Integer tokenUserId
    ) {
        if (!Objects.equals(sellerId, tokenUserId)) {
            log.warn("Forbidden access attempt: Token User ID {} tried to access Seller ID {}'s order {}", tokenUserId, sellerId, orderId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User ID in access token not matched with resource ID");
        }
        Order order = orderRepo.findByIdAndSeller_Id(orderId, sellerId)
                .orElseThrow(() -> new ItemNotFoundException("Order not found with id: " + orderId + " for seller: " + sellerId));
        if (!Boolean.TRUE.equals(order.getViewedBySeller())) {
            log.info("Marking order ID {} as viewed by seller {}", orderId, sellerId);
            order.setViewedBySeller(true);
            orderRepo.save(order);
        }
        return toSellerOrderSummaryDto(order);
    }

    private OrderDto.SellerOrderSummary toSellerOrderSummaryDto(Order order) {
        OrderDto.SellerOrderSummary summary = new OrderDto.SellerOrderSummary();

        summary.setId(String.valueOf(order.getId()));
        summary.setSellerId(String.valueOf(order.getSeller().getId()));
        summary.setOrderDate(order.getOrderDate());
        summary.setPaymentDate(order.getPaymentDate());
        summary.setShippingAddress(order.getShippingAddress());
        summary.setOrderNote(order.getOrderNote());
        summary.setOrderStatus(order.getOrderStatus().name());
        summary.setViewedBySeller(order.getViewedBySeller());

        // Buyer Info
        OrderDto.SellerOrderSummary.BuyerBrief buyerBrief = new OrderDto.SellerOrderSummary.BuyerBrief();
        buyerBrief.setId(String.valueOf(order.getBuyer().getId()));
        buyerBrief.setUsername(order.getBuyer().getNickName());
        summary.setBuyer(buyerBrief);

        // Order Items
        List<OrderDto.SellerOrderSummary.OrderItemBrief> itemBriefs = new ArrayList<>();
        int itemNo = 1;
        for (OrderItem oi : order.getItems()) {
            OrderDto.SellerOrderSummary.OrderItemBrief ib = new OrderDto.SellerOrderSummary.OrderItemBrief();
            SaleItem saleItem = oi.getSaleItem();

            ib.setNo(itemNo++);
            ib.setSaleItemId(Long.valueOf(saleItem.getId()));
            ib.setPrice(oi.getPrice().intValue());
            ib.setQuantity(oi.getQuantity());
            ib.setDescription(oi.getDescription());
            itemBriefs.add(ib);
        }
        summary.setOrderItems(itemBriefs);

        return summary;
    }
}