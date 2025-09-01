package com.example.backend.controllers;

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
    @Autowired
    private JwtTokenUtils jwtTokenUtils;

//    @PostMapping(value = "/v2/users/register", consumes = {"multipart/form-data"})
//    public ResponseEntity<UserCreateResponseDto> registerUsers(@Valid @ModelAttribute UserCreateRequestDto request)
//            throws Exception {
//        var response = userService.registerUsers(request);
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }


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
}
