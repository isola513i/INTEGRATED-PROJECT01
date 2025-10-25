package com.example.backend.dtos;

import lombok.Data;

@Data
public class CartDetailRequest {
    private String shippingAddress;
    private String note;
}
