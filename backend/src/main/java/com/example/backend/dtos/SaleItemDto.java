package com.example.backend.dtos;

import com.example.backend.entities.Brand;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@NoArgsConstructor
public class SaleItemDto {

    @Data
    @NoArgsConstructor
    public static class GetAllSaleItemsDto {
        private Integer id;
        private String model;

        private Integer brandId;
        private String brandName;

        private Integer price;
        private Integer ramGb;
        private Integer storageGb;
        private String color;
    }

    @Data
    @NoArgsConstructor
    public static class GetSaleItemDto {
        private Integer id;
        private String model;

        private Integer brandId;
        private String brandName;

        private String description;
        private Integer price;
        private Integer ramGb;
        private BigDecimal screenSizeInch;
        private Integer quantity;
        private Integer storageGb;
        private String color;
        private Instant createdOn;
        private Instant updatedOn;
    }

    @Data
    public static class GetCreateSaleItemDto {
        private String model;
        private BrandDto.GetAllBrandDto brand;
        private String description;
        private Integer price;
        private Integer ramGb;
        private BigDecimal screenSizeInch;
        private Integer quantity;
        private Integer storageGb;
        private String color;

        public void setModel(String model) { this.model = clean(model); }
        public void setQuantity(Integer quantity){ this.quantity = (quantity == null || quantity < 0) ? 1 : quantity; }
        public void setDescription(String description) { this.description = clean(description); }
        public void setColor(String color) { this.color = clean(color); }
        private String clean(String input) { return (input != null && !input.trim().isEmpty()) ? input.trim() : null; }
    }
}

