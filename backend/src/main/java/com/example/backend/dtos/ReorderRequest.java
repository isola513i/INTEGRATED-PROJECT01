package com.example.backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReorderRequest(@NotNull @NotEmpty List<Integer> pictureIds) {}





