package com.example.backend.dtos;

import lombok.Data;

@Data
public class CartDetailResponse {
    private String shippingAddress;
    private String note;
}
