package com.example.backend.controllers;

import com.example.backend.dtos.UserCreateRequestDto;

import com.example.backend.dtos.UserCreateResponseDto;
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/itb-mshop")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/v2/users/register")
    public UserCreateResponseDto addUser(@RequestBody UserCreateRequestDto user){

        return new UserCreateResponseDto();
    }

}
