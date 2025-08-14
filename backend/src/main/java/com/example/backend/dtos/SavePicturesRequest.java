package com.example.backend.dtos;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SavePicturesRequest(@NotNull List<Integer> pictureIds) {}