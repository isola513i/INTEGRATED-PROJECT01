package com.example.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangePasswordRequestDto {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;


}
