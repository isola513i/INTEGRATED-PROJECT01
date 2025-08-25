package com.example.backend.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.Iterator;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileStorage {

    private static final Logger log = LoggerFactory.getLogger(FileStorage.class);

    @Value("${itbms.upload-dir:uploads/sale-items}")
    private String baseDir;
    @Value("${itbms.upload-dir.users:uploads/users}")
    private String userBaseDir;

    @Getter @AllArgsConstructor
    public static class StoredFile {
        private String fileName;
        private String path;
    }

    public StoredFile storeSaleItemFile(Integer saleItemId, MultipartFile file) throws IOException {
        Path root = getRoot();
        Path dir = root.resolve(String.valueOf(saleItemId)).normalize();
        if (!dir.startsWith(root)) throw new IOException("Invalid path resolution");
        Files.createDirectories(dir);

        String safe = UUID.randomUUID().toString().replace("-", "") + ".jpg";
        Path target = dir.resolve(safe).normalize();
        if (!target.startsWith(root)) throw new IOException("Invalid target path");

        BufferedImage src;
        try (var in = file.getInputStream()) {
            src = ImageIO.read(in);
        }
        if (src == null) {
            throw new IOException("Unsupported image format: " + file.getOriginalFilename());
        }

        BufferedImage rgb = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = rgb.createGraphics();
        try {
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, rgb.getWidth(), rgb.getHeight());
            g.drawImage(src, 0, 0, null);
        } finally {
            g.dispose();
        }

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) {
            throw new IOException("No JPEG writer available");
        }
        ImageWriter writer = writers.next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(target.toFile())) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.9f);
            }
            writer.write(null, new javax.imageio.IIOImage(rgb, null, null), param);
        } finally {
            writer.dispose();
        }

        return new StoredFile(safe, saleItemId + "/" + safe);
    }

    public StoredFile storeUserIdCardFile(Integer userId, MultipartFile file, String side) throws IOException {
        Path root = Paths.get(userBaseDir).toAbsolutePath().normalize();
        Path dir = root.resolve(String.valueOf(userId)).normalize();
        if (!dir.startsWith(root)) throw new IOException("Invalid path resolution");
        Files.createDirectories(dir);

        String safe = UUID.randomUUID().toString().replace("-", "") + "_" + side + ".jpg";
        Path target = dir.resolve(safe).normalize();
        if (!target.startsWith(root)) throw new IOException("Invalid target path");

        BufferedImage src;
        try (var in = file.getInputStream()) {
            src = ImageIO.read(in);
        }
        if (src == null) throw new IOException("Unsupported image format: " + file.getOriginalFilename());

        BufferedImage rgb = new BufferedImage(src.getWidth(), src.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = rgb.createGraphics();
        try {
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, rgb.getWidth(), rgb.getHeight());
            g.drawImage(src, 0, 0, null);
        } finally { g.dispose(); }

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpg");
        if (!writers.hasNext()) throw new IOException("No JPEG writer available");
        ImageWriter writer = writers.next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(target.toFile())) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            if (param.canWriteCompressed()) {
                param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                param.setCompressionQuality(0.9f);
            }
            writer.write(null, new javax.imageio.IIOImage(rgb, null, null), param);
        } finally { writer.dispose(); }

        return new StoredFile(safe, userId + "/" + safe);
    }

    private Path getRoot() {
        return Paths.get(baseDir).toAbsolutePath().normalize();
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


