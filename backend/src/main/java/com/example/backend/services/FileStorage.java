package com.example.backend.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(FileStorage.class);

    @Value("${itbms.upload-dir:uploads/sale-items}")
    private String baseDir;

    @Getter @AllArgsConstructor
    public static class StoredFile {
        private String fileName;
        private String path;
    }

    public StoredFile storeSaleItemFile(Integer saleItemId, MultipartFile file) throws IOException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");

        String safe = UUID.randomUUID().toString().replace("-", "") + ext;
        Path root = Paths.get(baseDir).toAbsolutePath().normalize();
        Path dir = root.resolve(String.valueOf(saleItemId)).normalize();

        if (!dir.startsWith(root)) {
            throw new IOException("Invalid path resolution");
        }
        Files.createDirectories(dir);
        Path target = dir.resolve(safe).normalize();

        if (!target.startsWith(root)) {
            throw new IOException("Invalid target path");
        }
        file.transferTo(target);
        return new StoredFile(safe, "sale-items/" + saleItemId + "/" + safe);
    }

    public byte[] readFile(String relativePath) throws IOException {
        try {
            Path root = Paths.get(baseDir).toAbsolutePath().normalize();
            Path target = root.resolve(relativePath).normalize();

            if (!target.startsWith(root)) {
                throw new IOException("Invalid file path");
            }

            if (!Files.exists(target)) {
                throw new IOException("File not found: " + relativePath);
            }

            return Files.readAllBytes(target);

        } catch (Exception ex) {
            log.error("Failed to read file: {}", relativePath, ex);
            throw new IOException("Cannot read file: " + relativePath, ex);
        }
    }

    public void deleteIfExists(String relativePath) {
        try {
            Path root = Paths.get(baseDir).toAbsolutePath().normalize();
            Path target = root.resolve(relativePath).normalize();
            if (!target.startsWith(root)) {
                throw new IOException("Invalid delete path");
            }
            boolean deleted = Files.deleteIfExists(target);
            if (!deleted) {
                log.warn("File not found to delete: {}", target);
            } else {
                log.info("Deleted file: {}", target);
            }
        } catch (Exception ex) {
            log.error("Failed to delete file: {}", relativePath, ex);
        }
    }
}

