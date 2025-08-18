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

    /** root จริงบนดิสก์ อ้างอิงจาก baseDir เสมอ */
    private Path getRoot() {
        return Paths.get(baseDir).toAbsolutePath().normalize();
    }

    /** จัดเก็บไฟล์อัปโหลดเข้าโฟลเดอร์ของ item และคืน relative path แบบสั้น "{id}/{file}" */
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

        // ⬅️ เก็บแบบสั้น: "{id}/{file}"
        return new StoredFile(safe, saleItemId + "/" + safe);
    }

    /** ลบไฟล์จาก relativePath; รองรับ path แบบเก่าที่ขึ้นต้นด้วย "sale-items/" */
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

    /** รีเนมไฟล์ในโฟลเดอร์ของ item และคืน relative path แบบสั้น "{id}/{newName}" */
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
        // ⬅️ คืนแบบสั้น: "{id}/{file}"
        return saleItemId + "/" + newFileName;
    }

    /** โหลดไฟล์ของ item เป็น Resource (ใช้ใน Controller) */
    public FileSystemResource loadSaleItemFile(Integer saleItemId, String fileName) {
        Path root = getRoot();
        Path path = root.resolve(String.valueOf(saleItemId)).resolve(fileName).normalize();
        if (!path.startsWith(root)) {
            // ป้องกัน path traversal
            return new FileSystemResource(new File("/dev/null")); // จะ exists=false
        }
        return new FileSystemResource(path.toFile());
    }

    /** โหลดจาก relativePath (เช่น "{id}/{file}") */
    public FileSystemResource loadByRelativePath(String relativePath) {
        String normalizedRel = normalizeRelative(relativePath);
        Path root = getRoot();
        Path path = root.resolve(normalizedRel).normalize();
        return new FileSystemResource(path.toFile());
    }

    /** 🔧 helper: รองรับทั้ง path รุ่นเก่า "sale-items/{id}/{file}" และแบบใหม่ "{id}/{file}" */
    private String normalizeRelative(String relativePath) {
        String rel = Optional.ofNullable(relativePath).orElse("").replace("\\", "/");
        if (rel.startsWith("sale-items/")) {
            rel = rel.substring("sale-items/".length());
        }
        // รูปแบบเป้าหมาย: "{id}/{file}"
        return rel;
    }
}


