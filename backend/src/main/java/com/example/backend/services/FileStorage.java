package com.example.backend.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorage {

    private static final Logger log = LoggerFactory.getLogger(FileStorage.class);

    @Value("${itbms.upload-dir:uploads/sale-items}")
    private String baseDir;

    @Getter @AllArgsConstructor
    public static class StoredFile {
        private String fileName; // ชื่อไฟล์จริงในโฟลเดอร์ของ item
        private String path;     // relative path ที่เก็บใน DB: "{itemId}/{fileName}"
    }

    private Path getRoot() {
        return Paths.get(baseDir).toAbsolutePath().normalize();
    }

    public StoredFile storeSaleItemFile(Integer saleItemId, MultipartFile file) throws IOException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");

        String safe = UUID.randomUUID().toString().replace("-", "") + ext;

        Path root = getRoot();
        Path dir = root.resolve(String.valueOf(saleItemId)).normalize();
        if (!dir.startsWith(root)) throw new IOException("Invalid path resolution");

        Files.createDirectories(dir);

        Path target = dir.resolve(safe).normalize();
        if (!target.startsWith(root)) throw new IOException("Invalid target path");

        file.transferTo(target);

        return new StoredFile(safe, saleItemId + "/" + safe);
    }

    public void deleteIfExists(String relativePath) {
        try {
            String normalizedRel = normalizeRelative(relativePath);

            Path root = getRoot();
            Path target = root.resolve(normalizedRel).normalize();
            if (!target.startsWith(root)) throw new IOException("Invalid delete path");

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

    public String renameSaleItemFile(Integer saleItemId, String oldFileName, String newFileName) throws IOException {
        Path root = getRoot();
        Path dir = root.resolve(String.valueOf(saleItemId)).normalize();
        if (!dir.startsWith(root)) throw new IOException("Invalid dir");

        Files.createDirectories(dir);

        Path from = dir.resolve(oldFileName).normalize();
        Path to   = dir.resolve(newFileName).normalize();

        if (!from.startsWith(root) || !to.startsWith(root)) {
            throw new IOException("Invalid move path");
        }

        if (Files.exists(from)) {
            Files.move(from, to, StandardCopyOption.REPLACE_EXISTING);
        } else {
            log.warn("Source file to rename not found: {}", from);
        }
        return saleItemId + "/" + newFileName;
    }

    public FileSystemResource loadSaleItemFile(Integer saleItemId, String fileName) {
        Path root = getRoot();
        Path path = root.resolve(String.valueOf(saleItemId)).resolve(fileName).normalize();
        if (!path.startsWith(root)) {
            return new FileSystemResource(new File("/dev/null"));
        }
        return new FileSystemResource(path.toFile());
    }

    public FileSystemResource loadByRelativePath(String relativePath) {
        String normalizedRel = normalizeRelative(relativePath);
        Path root = getRoot();
        Path path = root.resolve(normalizedRel).normalize();
        return new FileSystemResource(path.toFile());
    }

    private String normalizeRelative(String relativePath) {
        String rel = Optional.ofNullable(relativePath).orElse("").replace("\\", "/");
        if (rel.startsWith("sale-items/")) {
            rel = rel.substring("sale-items/".length());
        }
        return rel;
    }

    public void deleteItemDirectory(Integer saleItemId) {
        try {
            Path root = Paths.get(baseDir).toAbsolutePath().normalize();
            Path dir = root.resolve(String.valueOf(saleItemId)).normalize();
            if (!dir.startsWith(root)) throw new IOException("Invalid dir path");

            if (Files.exists(dir)) {
                // ลบ recursive
                Files.walk(dir)
                        .sorted(Comparator.reverseOrder())
                        .forEach(p -> {
                            try { Files.deleteIfExists(p); }
                            catch (IOException e) { log.warn("Failed to delete: {}", p, e); }
                        });
                log.info("Deleted directory for item {}: {}", saleItemId, dir);
            }
        } catch (Exception ex) {
            log.error("Failed to delete item directory: {}", saleItemId, ex);
        }
    }

}


