package com.example.backend.services;

import com.example.backend.dtos.OrderDto;
import com.example.backend.entities.Order;
import com.example.backend.entities.OrderItem;
import com.example.backend.entities.SaleItem;
import com.example.backend.entities.User;
import com.example.backend.enums.OrderStatus;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.exceptions.SellerNotMatchInTokenException;
import com.example.backend.repositories.CartItemRepository;
import com.example.backend.repositories.CartRepository;
import com.example.backend.repositories.OrderRepository;
import com.example.backend.repositories.SaleItemRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.exceptions.QuantityNotEnoughException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public OrderDto.PlaceOrderResponse placeOrder(OrderDto.PlaceOrderRequest req, Long tokenUserId) {
        // 403: token user ต้องตรงกับ buyerId
        if (!Objects.equals(tokenUserId, req.getBuyerId())) {
            throw new SellerNotMatchInTokenException("Buyer mismatch with token");
        }

        User buyer = userRepo.findById(req.getBuyerId().intValue())
                .orElseThrow(() -> new ItemNotFoundException("Buyer not found"));

        var maybeCart = cartRepo.findByBuyerId(buyer.getId());
        List<OrderDto.OrderSummary> summaries = new ArrayList<>();

        for (var group : req.getSellerGroups()) {
            User seller = userRepo.findById(group.getSellerId().intValue())
                    .orElseThrow(() -> new ItemNotFoundException("Seller not found"));

            Order order = new Order();
            order.setBuyer(buyer);
            order.setSeller(seller);
            order.setShippingAddress(req.getShippingAddress());
            order.setOrderNote(req.getOrderNote());
            order.setOrderStatus(OrderStatus.COMPLETED);
            order.setTotalPrice(BigDecimal.ZERO);

            List<Integer> selectedSaleItemIds = new ArrayList<>();

            for (var it : group.getItems()) {
                SaleItem saleItem = saleItemRepo.findById(it.getSaleItemId().intValue())
                        .orElseThrow(() -> new ItemNotFoundException("Sale item not found"));

                if (!Objects.equals(saleItem.getSeller().getId(), seller.getId())) {
                    throw new IllegalArgumentException("Item not owned by the specified seller");
                }

                if (saleItem.getQuantity() < it.getQuantity()) {
                    throw new QuantityNotEnoughException("Quantity Not Enough");
                }

                int updated = saleItemRepo.deductStock(saleItem.getId(), it.getQuantity());
                if (updated == 0) {
                    throw new QuantityNotEnoughException("Quantity Not Enough");
                }

                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setSaleItem(saleItem);
                oi.setPrice(BigDecimal.valueOf(saleItem.getPrice()));
                oi.setQuantity(it.getQuantity());
                oi.setDescription(saleItem.getModel());
                order.getItems().add(oi);

                order.setTotalPrice(
                        order.getTotalPrice().add(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                );

                selectedSaleItemIds.add(saleItem.getId());
            }

            order = orderRepo.save(order);
            maybeCart.ifPresent(c -> cartItemRepo.deleteSelected(c.getId(), selectedSaleItemIds));

            summaries.add(toSummary(order));
        }

        return new OrderDto.PlaceOrderResponse(summaries);
    }

    private OrderDto.OrderSummary toSummary(Order o) {
        OrderDto.OrderSummary s = new OrderDto.OrderSummary();
        s.setId(o.getId().intValue());
        s.setBuyerId(Long.valueOf(o.getBuyer().getId()));

        OrderDto.SellerBrief sb = new OrderDto.SellerBrief();
        sb.setId(o.getSeller().getId());
        sb.setUsername(o.getSeller().getNickName());
        s.setSeller(sb);

        s.setOrderDate(o.getOrderDate());
        s.setPaymentDate(o.getPaymentDate());
        s.setShippingAddress(o.getShippingAddress());
        s.setOrderNote(o.getOrderNote());
        s.setOrderStatus(o.getOrderStatus().name());

        List<OrderDto.OrderItemBrief> itemBriefs = new ArrayList<>();
        int i = 1;
        for (OrderItem oi : o.getItems()) {
            OrderDto.OrderItemBrief ib = new OrderDto.OrderItemBrief();
            ib.setNo(i++);
            ib.setSaleItemId(Long.valueOf(oi.getSaleItem().getId()));
            ib.setPrice(oi.getPrice().intValue());
            ib.setQuantity(oi.getQuantity());
            ib.setDescription(oi.getDescription());
            itemBriefs.add(ib);
        }
        s.setOrderItems(itemBriefs);
        return s;
    }

}

