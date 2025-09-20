package com.example.backend.dtos;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfileViewDto {
    private Integer id;
    private String email;
    private String fullName;
    private String userType;   // BUYER | SELLER
    private String nickName;

    // Only SELLER (read-only;)
    private String phoneNumber;   // e.g. xxxxx678x
    private String bankName;
    private String bankAccount;   // e.g. xxxxxx901x
}
