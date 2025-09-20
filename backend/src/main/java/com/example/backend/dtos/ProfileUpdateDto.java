package com.example.backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfileUpdateDto {
    private String fullName;
    private String nickName;
}
