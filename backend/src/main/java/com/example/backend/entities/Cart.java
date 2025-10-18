package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.Getter; import lombok.Setter;
import java.util.ArrayList; import java.util.List;

@Getter @Setter
@Entity @Table(name = "carts")
public class Cart {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false, unique = true)
    private User buyer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "note")
    private String note;
}
