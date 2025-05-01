package com.example.backend.dtos;

import com.example.backend.entities.Brand;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SaleItemDto {
    @Data
    @NoArgsConstructor
    public static class GetAllSaleItemsDto {
        private Integer id;
        private String model;
        @JsonIgnore
        private Brand brand;

        @JsonProperty("brandName")
        public String getBrandName() {
            return brand != null ? brand.getName() : null;
        }

        private Integer price;
        private Integer storageGb;
        private String color;
    }
    @Data
    @NoArgsConstructor
    public static class GetSaleItemDto {
        private Integer id;
        private String model;
        @JsonIgnore
        private Brand brand;

        @JsonProperty("brandName")
        public String getBrandName() {
            return brand != null ? brand.getName() : null;
        }
        private String description;
        private Integer price;
        private Integer ramGb;
        private Integer screenSizeInch;
        private Integer quantity;
        private Integer storageGb;
        private String color;
    }

}
