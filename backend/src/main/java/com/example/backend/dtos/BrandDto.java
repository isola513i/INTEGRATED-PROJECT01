package com.example.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BrandDto {
    @Data
    @NoArgsConstructor
    public static class GetAllBrandDto{
        private Integer id;
        private String name;
    }
    @Data
    @NoArgsConstructor
    public static class GetBrandDto {
        private Integer id;
        private String name;
        private String websiteUrl;
        private Boolean isActive;
        private String countryOfOrigin;
        private Integer noOfSaleItems;
    }
    @Data
    @NoArgsConstructor
    public static class UpdateBrandDto {
        private String name;
        private String websiteUrl;
        private Boolean isActive;
        private String countryOfOrigin;
    }
}
