package com.example.backend.dtos;

import lombok.Data;

@Data
public class JwtRequestUser {
    private String email;
    private String password;
}
