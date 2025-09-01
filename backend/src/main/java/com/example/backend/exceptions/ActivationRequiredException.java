package com.example.backend.exceptions;

public class ActivationRequiredException extends RuntimeException {
    public ActivationRequiredException(String message) { super(message); }
}