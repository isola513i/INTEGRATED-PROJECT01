package com.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfileUpdateDto {
    @NotBlank
    private String fullName;
    @NotBlank
    private String nickName;
}
