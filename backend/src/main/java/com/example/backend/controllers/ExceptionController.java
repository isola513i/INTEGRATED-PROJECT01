package com.example.backend.controllers;

import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.exceptions.MyErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.util.Optional;

@org.springframework.web.bind.annotation.RestControllerAdvice
@org.springframework.core.annotation.Order(org.springframework.core.Ordered.HIGHEST_PRECEDENCE)
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

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<MyErrorResponse> handleMultipart(MultipartException ex,
                                                           HttpServletRequest req) {
        var body = new MyErrorResponse(400, "BAD_REQUEST",
                "Invalid multipart request.", req.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<MyErrorResponse> handleNotReadable(HttpMessageNotReadableException ex,
                                                             HttpServletRequest req) {
        var body = new MyErrorResponse(400, "BAD_REQUEST",
                "Malformed JSON request.", req.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<MyErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                            HttpServletRequest req) {
        var msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .reduce((a,b) -> a + ", " + b).orElse("Validation failed");
        var body = new MyErrorResponse(400, "BAD_REQUEST", msg, req.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<MyErrorResponse> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex,
                                                               HttpServletRequest req) {
        var body = new MyErrorResponse(422, "UNPROCESSABLE_ENTITY",
                "Request conflicts with database constraints.", req.getRequestURI());
        return ResponseEntity.status(422).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MyErrorResponse> handleAny(Exception ex, HttpServletRequest req) {
        var body = new MyErrorResponse(500, "INTERNAL_SERVER_ERROR",
                "Unexpected error.", req.getRequestURI());
        return ResponseEntity.status(500).body(body);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<MyErrorResponse> handleIllegalState(IllegalStateException ex,
                                                              HttpServletRequest request) {
        var body = new MyErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.name(),
                ex.getMessage(),
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<MyErrorResponse> handleRSE(org.springframework.web.server.ResponseStatusException ex,
                                                     jakarta.servlet.http.HttpServletRequest req) {
        int code = ex.getStatusCode().value();
        var body = new MyErrorResponse(code, ex.getStatusCode().toString(),
                Optional.ofNullable(ex.getReason()).orElse("Bad request"), req.getRequestURI());
        return ResponseEntity.status(code).body(body);
    }


}
