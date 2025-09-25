package com.example.backend.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class SellerNotMatchInTokenException extends RuntimeException {
    public SellerNotMatchInTokenException(String message) {
        super(message);
    }
}
