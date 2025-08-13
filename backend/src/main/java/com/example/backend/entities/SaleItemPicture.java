package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "sale_item_pictures")
public class SaleItemPicture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pictureId", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "saleItemId", nullable = false)
    private SaleItem saleItem;

    @Size(max = 255)
    @NotNull
    @Column(name = "fileName", nullable = false)
    private String fileName;

    @Size(max = 255)
    @NotNull
    @Column(name = "filePath", nullable = false)
    private String filePath;

    @NotNull
    @Column(name = "position", nullable = false)
    private Integer position;

    @CreationTimestamp
    @Column(name = "createdOn", nullable = false, updatable = false)
    private Instant createdOn;

    @UpdateTimestamp
    @Column(name = "updatedOn", nullable = false)
    private Instant updatedOn;

}