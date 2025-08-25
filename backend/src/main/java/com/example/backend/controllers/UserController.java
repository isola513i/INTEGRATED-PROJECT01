package com.example.backend.controllers;

import com.example.backend.dtos.UserCreateRequestDto;

import com.example.backend.dtos.UserCreateResponseDto;
import com.example.backend.services.UserService;
import jakarta.validation.Valid;
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

    @PostMapping(value = "/v2/users/register", consumes = {"multipart/form-data"})
    public ResponseEntity<UserCreateResponseDto> registerUsers(@Valid @ModelAttribute UserCreateRequestDto request)
            throws Exception {
        var response = userService.registerUsers(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
