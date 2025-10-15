package com.example.backend.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartItemDto {
    private Long id;
    private String model;
    private String brandName;
    private String description;
    private Integer price;
    private Integer ramGb;
    private BigDecimal screenSizeInch;
    private Integer storageGb;
    private String color;
    private List<SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto> saleItemImages;
    private Integer sellerId;
    private String sellerUsername;
    private Integer quantity;
}
