package com.example.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class BrandDto {
    @Data
    @NoArgsConstructor
    public static class GetAllBrand{
        private Integer brandId;
        private String name;
    }
    @Data
    @NoArgsConstructor
    public static class GetBrand{
        private Integer brandId;
        private String name;
        private String websiteUrl;
        private boolean isActive;
        private String countryOfOrigin;
        private LocalDateTime createdOn;
        private LocalDateTime updatedOn;
    }

}
