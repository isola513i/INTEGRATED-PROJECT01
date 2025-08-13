package com.example.backend.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorage {
    @Value("${itbms.upload-dir:uploads/sale-items}")
    private String baseDir;

    @Getter
    @AllArgsConstructor
    public static class StoredFile { private String fileName; private String path; }

    public StoredFile storeSaleItemFile(Integer saleItemId, MultipartFile file) throws IOException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains(".")).map(n -> n.substring(n.lastIndexOf('.'))).orElse("");
        String safe = UUID.randomUUID().toString().replace("-", "") + ext;
        Path dir = Paths.get(baseDir).resolve(String.valueOf(saleItemId));
        Files.createDirectories(dir);
        Path target = dir.resolve(safe);
        file.transferTo(target);
        return new StoredFile(safe, "sale-items/" + saleItemId + "/" + safe);
    }

    public void deleteIfExists(String relativePath) {
        try {
            Paths.get(baseDir).resolve(relativePath).toFile().delete();
        } catch (Exception ex) {
            logger.error("Failed to delete file: {}", relativePath, ex);
        }
    }
}

