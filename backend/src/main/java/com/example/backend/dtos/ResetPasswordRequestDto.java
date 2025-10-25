package com.example.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetPasswordRequestDto {
    private String email;
    private String newPassword;
    private String confirmNewPassword;
}
