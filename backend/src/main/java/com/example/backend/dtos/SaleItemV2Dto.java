package com.example.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
//@NoArgsConstructor
public class SaleItemV2Dto {

    // ---------- REQUEST ----------
        @Data
        @NoArgsConstructor
        public static class SaleItemWithImageInfo {
            private SaleItemDto.GetCreateSaleItemDto saleItem;
            private List<SaleItemImageRequest> imageInfos;
        }

    // ---------- RESPONSE ----------
    @Data
    @NoArgsConstructor
    public static class SaleItemV2Response {
        private Integer id;
        private String model;
        private String brandName;
        private String description;
        private Integer price;
        private Integer ramGb;
        private BigDecimal screenSizeInch;
        private Integer quantity;
        private Integer storageGb;
        private String color;
        private List<SaleItemImageDto> saleItemImages;
        private Instant createdOn;
        private Instant updatedOn;

        @Data
        @NoArgsConstructor
        public static class SaleItemImageDto {
            private String fileName;
            private Integer imageViewOrder;
        }
    }
    @Data
    @NoArgsConstructor
    public static class SaleItemV2SellerResponse {
        private Integer id;
        private String model;
        private String brandName;
        private Integer price;
        private Integer ramGb;
        private Integer storageGb;
        private String color;
        private SellerDto seller;


        @Data
        public static class SellerDto {
            private Integer id;
            private String username;
            public SellerDto(Integer id, String username) {
                this.id = id;
                this.username = username;
            }
        }
    }

    @Data
    @NoArgsConstructor
    public static class SaleItemImageRequest {
        private String fileName;
        private Integer order;
        private ImageStatus status;
        private MultipartFile imageFile;
    }

}

