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
    /** Payload หลักที่ FE ส่งมา (กลุ่มตาม seller) */
    @Data @NoArgsConstructor
    public static class PlaceOrderRequest {
        @NotNull
        private Long buyerId;
        @Size(max = 255)
        private String shippingAddress;
        @Size(max = 255)
        private String orderNote;
        /** หนึ่งกลุ่ม = หนึ่งผู้ขาย -> สร้าง 1 ใบออเดอร์ */
        @NotNull @Size(min = 1)
        private List<SellerOrderGroup> sellerGroups = new ArrayList<>();
    }

    /** กลุ่มรายการของ “ผู้ขาย” คนเดียว */
    @Data @NoArgsConstructor
    public static class SellerOrderGroup {
        @NotNull
        private Long sellerId;
        @NotNull @Size(min = 1)
        private List<SelectedCartItem> items = new ArrayList<>();
    }

    /** รายการที่ผู้ใช้ติ๊กเลือกจากตะกร้า */
    @Data @NoArgsConstructor
    public static class SelectedCartItem {
        @NotNull
        private Long saleItemId;
        @NotNull @Positive
        private Integer quantity;
    }

    // =====================  RESPONSE  =====================
    /** 201 Created: คืน "array of orders" */
    @Data @NoArgsConstructor
    public static class PlaceOrderResponse {
        @NotNull
        private List<OrderSummary> orders = new ArrayList<>();
        public PlaceOrderResponse(List<OrderSummary> orders){ this.orders = orders; }
    }

    /** สรุปออเดอร์ 1 ใบตามที่สไลด์กำหนด */
    @Data @NoArgsConstructor
    public static class OrderSummary {
        private Integer id;
        private Long buyerId;
        private SellerBrief seller;
        private Instant orderDate;
        private Instant paymentDate;
        private String shippingAddress;
        private String orderNote;
        private List<OrderItemBrief> orderItems = new ArrayList<>();
        private String orderStatus;     // COMPLETED / CANCELED
    }

    /** สรุปผู้ขายแบบสั้น ๆ ในออเดอร์ */
    @Data @NoArgsConstructor
    public static class SellerBrief {
        private Integer id;
        private String username;
    }

    /** รายการสินค้าในออเดอร์ (ตามกล่องเทาในสไลด์) */
    @Data @NoArgsConstructor
    public static class OrderItemBrief {
        private Integer no;
        private Long saleItemId;
        private Integer price;
        private Integer quantity;
        private String description;
    }

}
