package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "sale_items", schema = "itbms")
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saleItemId", nullable = false)
    private Integer id;

    @Size(max = 60)
    @NotNull
    @Column(name = "model", nullable = false, length = 60)
    private String model;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brandId", nullable = false)
    private Brand brand;

    @NotNull
    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "ramGb")
    private Integer ramGb;

    @Column(name = "screenSizeInch", precision = 4, scale = 2)
    private BigDecimal screenSizeInch;

    @Column(name = "storageGb")
    private Integer storageGb;

    @Size(max = 30)
    @Column(name = "color", length = 30)
    private String color;

    @NotNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull
    @Column(name = "createdOn", nullable = false)
    private Instant createdOn;

    @NotNull
    @Column(name = "updatedOn", nullable = false)
    private Instant updatedOn;

}