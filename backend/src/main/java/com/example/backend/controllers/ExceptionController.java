package com.example.backend.controllers;

import com.example.integratedproject1.exceptions.ItemNotFoundException;
import com.example.integratedproject1.exceptions.MyErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionController {
    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<MyErrorResponse> handleItemNotFoundException(
            ItemNotFoundException ex, HttpServletRequest request){
        MyErrorResponse myErrorResponse = new MyErrorResponse(HttpStatus.NOT_FOUND.value(),HttpStatus.NOT_FOUND.name(),ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(myErrorResponse);
    }
}
