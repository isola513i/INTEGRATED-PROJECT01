package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "itbms")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userId", nullable = false)
    private Integer id;

    @Size(max = 40)
    @NotNull
    @Column(name = "nickName", nullable = false, length = 40)
    private String nickName;

    @Size(max = 120)
    @NotNull
    @Column(name = "email", nullable = false, length = 120)
    private String email;

    @Size(max = 100)
    @NotNull
    @Column(name = "passwordHash", nullable = false, length = 100)
    private String passwordHash;

    @Size(max = 40)
    @NotNull
    @Column(name = "fullName", nullable = false, length = 40)
    private String fullName;

    @Size(max = 10)
    @NotNull
    @Column(name = "userType", nullable = false, length = 10)
    private String userType;

    @Size(max = 20)
    @Column(name = "phoneNumber", length = 20)
    private String phoneNumber;

    @Size(max = 40)
    @Column(name = "bankAccount", length = 40)
    private String bankAccount;

    @Size(max = 60)
    @Column(name = "bankName", length = 60)
    private String bankName;

    @Size(max = 20)
    @Column(name = "idCardNumber", length = 20)
    private String idCardNumber;

    @Size(max = 255)
    @Column(name = "idCardImageFront")
    private String idCardImageFront;

    @Size(max = 255)
    @Column(name = "idCardImageBack")
    private String idCardImageBack;

    @Size(max = 512)
    @Column(name = "latestVerifyToken", length = 512)
    private String latestVerifyToken;

    @NotNull
    @Column(name = "isActive", nullable = false)
    private Boolean isActive = false;

    @Column(name = "createdOn",nullable = false,insertable = false,updatable = false,columnDefinition = "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP")
    private Instant createdOn;

    @Column(name = "updatedOn",nullable = false,insertable = false,updatable = false,columnDefinition = "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Instant updatedOn;

}