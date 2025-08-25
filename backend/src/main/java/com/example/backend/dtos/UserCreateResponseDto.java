package com.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserCreateResponseDto {
    private Integer id;
    private String nickName;
    private String email;
    private String fullName;
    private String phoneNumber;
    @JsonProperty("isActive")
    private boolean active;
    private String userType;
}
