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
    public static class UpdateBrandDto {
        private String name;
        private String websiteUrl;
        private Boolean isActive=true;
        private String countryOfOrigin;

        public void setName(){
            this.name = clean(name);
        }
        public void setWebsiteUrl(){
            this.websiteUrl = clean(websiteUrl);
        }
        public void setCountryOfOrigin(){
            this.countryOfOrigin = clean(countryOfOrigin);
        }
        private String clean(String input) {
            return (input != null && !input.trim().isEmpty()) ? input.trim() : null;
        }
    }
}
