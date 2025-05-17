package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "brands", schema = "itbms")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brandId", nullable = false)
    private Integer id;

    @Size(max = 30)
    @NotNull
    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Size(max = 40)
    @Column(name = "websiteUrl", length = 40)
    private String websiteUrl;

    @Column(name = "isActive")
    private Boolean isActive;

    @Size(max = 80)
    @Column(name = "countryOfOrigin", length = 80)
    private String countryOfOrigin;

    @Column(name = "updatedOn", nullable = false, insertable = false,  updatable = false, columnDefinition = "DATETIME(6)")
    private Instant updatedOn;

    @Column(name = "createdOn", nullable = false, insertable = false, updatable = false, columnDefinition = "DATETIME(6)")
    private Instant createdOn;

    @OneToMany(mappedBy = "brand")
    private Set<SaleItem> saleItems = new LinkedHashSet<>();

    @Column(name="isDeleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "noOfSaleItems")
    private Integer noOfSaleItems;
}