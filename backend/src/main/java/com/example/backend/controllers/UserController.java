package com.example.backend.controllers;

import com.example.backend.dtos.JwtRequestUser;
import com.example.backend.dtos.UserCreateRequestDto;

import com.example.backend.dtos.UserCreateResponseDto;
import com.example.backend.entities.User;
import com.example.backend.services.EmailService;
import com.example.backend.services.UserService;
import com.example.backend.utils.JwtTokenUtils;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/itb-mshop")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/v2/users/register", consumes = {"multipart/form-data"})
    public ResponseEntity<UserCreateResponseDto> registerUsers(@Valid @ModelAttribute UserCreateRequestDto request)
            throws Exception {
        User savedUser = userService.registerUsers(request);
        if(savedUser != null){
            emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getLatestVerifyToken());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedUser, UserCreateResponseDto.class));
    }

    @PostMapping("/v2/users/verify-email")
    public ResponseEntity<UserCreateResponseDto> verifyByEmail(@RequestParam("token") String token){
        System.out.println(token);
        return ResponseEntity.ok(modelMapper.map(userService.verifyUserByEmail(token),UserCreateResponseDto.class));
    }

    @PostMapping("/v2/users/authentications")
    public ResponseEntity<Map<String, String>> authentications(@RequestBody JwtRequestUser body){
        return ResponseEntity.ok(userService.authenticate(body));
    }

    @PostMapping("/v2/users/authentications/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body){
        String refresh = body.getOrDefault("refresh_token", body.get("refreshToken"));
        if (refresh == null || refresh.isBlank()) {
            throw new IllegalArgumentException("refresh_token is required");
        }
        return ResponseEntity.ok(userService.refresh(refresh));
    }
}
