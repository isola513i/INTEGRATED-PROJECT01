package com.example.backend.controllers;


import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.exceptions.MyErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class ExceptionController {
    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<MyErrorResponse> handleItemNotFoundException(
            ItemNotFoundException ex, HttpServletRequest request){
        MyErrorResponse myErrorResponse = new MyErrorResponse(HttpStatus.NOT_FOUND.value(),HttpStatus.NOT_FOUND.name(),ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(myErrorResponse);
    }
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<MyErrorResponse> handleMaxUpload(MaxUploadSizeExceededException ex,
                                                           HttpServletRequest request) {
        MyErrorResponse body = new MyErrorResponse(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "PAYLOAD_TOO_LARGE",
                "Each image must be <= 2MB (total request size limit exceeded).",
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MyErrorResponse> handleBadRequest(IllegalArgumentException ex,
                                                            HttpServletRequest request) {
        MyErrorResponse body = new MyErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.name(),
                ex.getMessage(),
                request.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }
}
