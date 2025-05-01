package com.example.backend.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;


@Getter
@Setter
@RequiredArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MyErrorResponse {
    private Instant timeStamp = Instant.now();
    private final int status;
    private final String error;
    private final String message;
    private final String path;

}

