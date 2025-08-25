package com.example.backend.dtos;

import lombok.Data;

@Data
public class UserCreateResponseDto {
    private Integer id;
    private String nickname;
    private String email;
    private String fullName;
    private String phoneNumber;
    private boolean isActive;
    private String userType;
}
