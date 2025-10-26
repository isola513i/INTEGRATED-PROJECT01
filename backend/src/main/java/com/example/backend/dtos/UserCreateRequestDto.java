package com.example.backend.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserCreateRequestDto {
    @NotBlank
    private String nickName;
    @NotBlank
    @Email(message = "Email format is invalid")
    @Size(max = 50, message = "Email length must not exceed 50 characters")
    private String email;
    @NotBlank
    private String fullName;
    @NotBlank
    @Size(max = 14,min =8 , message = "Password length must not less than 8 and over 14 characters")
    private String password;
    @NotBlank
    private String userType;
    private String phoneNumber;
    private String bankAccount;
    private String bankName;
    private String idCardNumber;
    private MultipartFile idCardImageFront;
    private MultipartFile idCardImageBack;

    @AssertTrue(message = "Phone number is required for seller")
    private boolean isPhoneNumberValid(){
        if("seller".equalsIgnoreCase(userType)){
            return phoneNumber != null && !phoneNumber.isEmpty();
        }
        return true;
    }
    @AssertTrue(message = "Bank account is required for seller")
    private boolean isBankAccountValid(){
        if("seller".equalsIgnoreCase(userType)){
            return bankAccount != null && !bankAccount.isEmpty();
        }
        return true;
    }
    @AssertTrue(message = "Bank account name is required for seller")
    private boolean isBankNameValid(){
        if("seller".equalsIgnoreCase(userType)){
            return bankName != null && !bankName.isEmpty();
        }
        return true;
    }
    @AssertTrue(message = "ID Card number is required for seller")
    private boolean isIdCardValid() {
        if ("seller".equalsIgnoreCase(userType)) {
            return idCardNumber != null && !idCardNumber.isBlank();
        }
        return true;
    }
    @AssertTrue(message = "Front side of ID card image is required for seller")
    private boolean isIdCardFrontValid() {
        if ("seller".equalsIgnoreCase(userType)) {
            return idCardImageFront != null && !idCardImageFront.isEmpty();
        }
        return true;
    }
    @AssertTrue(message = "Back side of ID card image is required for seller")
    private boolean isIdCardBackValid() {
        if ("seller".equalsIgnoreCase(userType)) {
            return idCardImageBack != null && !idCardImageBack.isEmpty();
        }
        return true;
    }

}
