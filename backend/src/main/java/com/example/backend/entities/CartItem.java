package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter; import lombok.Setter;
import org.hibernate.annotations.OnDelete; import org.hibernate.annotations.OnDeleteAction;

@Getter @Setter
@Entity
@Table(
        name = "cart_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_cart_saleitem", columnNames = {"cart_id", "saleitem_id"})
)
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "saleitem_id", nullable = false)
    private SaleItem saleItem;

    @NotNull
    @Column(nullable = false)
    private Integer quantity;
}
