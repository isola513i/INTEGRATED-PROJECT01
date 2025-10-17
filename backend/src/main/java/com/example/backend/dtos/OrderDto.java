package com.example.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderDto {

    // =====================  REQUEST  =====================
    @Data @NoArgsConstructor
    public static class PlaceOrderRequest {
        @NotNull
        private Long buyerId;
        @Size(max = 255)
        private String shippingAddress;
        @Size(max = 255)
        private String orderNote;
        @NotNull @Size(min = 1)
        private List<SellerOrderGroup> sellerGroups = new ArrayList<>();
    }

    @Data @NoArgsConstructor
    public static class SellerOrderGroup {
        @NotNull
        private Long sellerId;
        @NotNull @Size(min = 1)
        private List<SelectedCartItem> items = new ArrayList<>();
    }

    @Data @NoArgsConstructor
    public static class SelectedCartItem {
        @NotNull
        private Long saleItemId;
        @NotNull @Positive
        private Integer quantity;
    }

    // ===================== Place Order RESPONSE  =====================
    @Data @NoArgsConstructor
    public static class PlaceOrderResponse {
        @NotNull
        private String id;
        private String buyerId;
        private SellerDto seller;
        private String orderDate;
        private String shippingAddress;
        private String orderNote;
        private List<OrderItemDto> orderItems;
        private String orderStatus;

        @Data
        public static class SellerDto {
            private String id;
            private String email;
            private String fullName;
            private String userType;
            private String nickName;
        }

        @Data
        public static class OrderItemDto {
            private Integer no;
            private Long itemId;
            private Integer price;
            private Integer quantity;
            private String description;
        }
    }

    // =====================  View Order Response  =====================
    @Data @NoArgsConstructor
    public static class BuyerOrderSummary {
        private Integer id;
        private String orderNo;
        private Instant orderDate;
        private Instant paymentDate;
        private Integer totalAmount;
        private String orderStatus;

        private SellerBrief seller;

        private String shippingAddress;
        private String orderNote;

        private List<BuyerOrderItem> orderItems = new ArrayList<>();

        @Data @NoArgsConstructor
        public static class SellerBrief {
            private Integer id;
            private String userName;
        }

        @Data @NoArgsConstructor
        public static class BuyerOrderItem {
            private Integer no;
            private Long saleItemId;
            private Integer price;
            private Integer quantity;
            private String description;
            private String imageUrl;
        }
    }

    @Data @NoArgsConstructor
    class BuyerOrdersPage {
        private List<BuyerOrderSummary> content = new ArrayList<>();
        private boolean last;
        private boolean first;
        private int totalPages;
        private long totalElements;
        private int size;
        private int page;
        private String sort;
    }
}
