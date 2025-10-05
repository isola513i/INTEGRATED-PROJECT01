package com.example.backend.entities;

import com.example.backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList; import java.util.List;

@Getter @Setter
@Entity @Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @CreationTimestamp
    @Column(name = "order_date", updatable = false)
    private Instant orderDate;

    @CreationTimestamp
    @Column(name = "payment_date", updatable = false)
    private Instant paymentDate;

    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    @Column(name = "order_note", length = 255)
    private String orderNote;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 16)
    private OrderStatus orderStatus = OrderStatus.COMPLETED;

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
