package com.example.backend.services;

import com.example.backend.dtos.PictureDto;
import com.example.backend.entities.SaleItemPicture;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.SaleItemPictureRepository;
import com.example.backend.repositories.SaleItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class SaleItemPictureService {
    private static final Set<String> ALLOWED = Set.of("image/jpeg","image/jpg","image/png","image/webp");
    private static final long MAX_BYTES = 2L*1024*1024;
    private static final int MAX_PICS = 4;

    private final SaleItemRepository itemRepo;
    private final SaleItemPictureRepository picRepo;
    private final FileStorage storage;

    public SaleItemPictureService(SaleItemRepository i, SaleItemPictureRepository p, FileStorage s) {
        this.itemRepo=i; this.picRepo=p; this.storage=s;
    }

    public List<PictureDto> list(Integer itemId) {
        return picRepo.findBySaleItemIdOrderByPositionAsc(itemId).stream()
                .map(p -> new PictureDto(p.getId(), "/" + p.getFilePath(), p.getPosition())).toList();
    }

    @Transactional
    public List<PictureDto> upload(Integer itemId, List<MultipartFile> files) throws IOException {
        var item = itemRepo.findById(itemId).orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
        long current = picRepo.countBySaleItemId(itemId);
        if (files==null || files.isEmpty()) throw new IllegalArgumentException("No files");
        if (current + files.size() > MAX_PICS) throw new IllegalStateException("Maximum 4 pictures are allowed.");

        int pos = (int) current;
        List<PictureDto> out = new ArrayList<>();
        for (MultipartFile f : files) {
            String ct = Objects.toString(f.getContentType(), "");
            if (!ALLOWED.contains(ct)) throw new IllegalArgumentException("Only jpeg/png/webp");
            if (f.getSize() > MAX_BYTES) throw new IllegalArgumentException("Each image must be <= 2MB");
            var saved = storage.storeSaleItemFile(itemId, f);
            var e = new SaleItemPicture();
            e.setSaleItem(item); e.setFileName(saved.getFileName()); e.setFilePath(saved.getPath()); e.setPosition(pos++);
            picRepo.save(e);
            out.add(new PictureDto(e.getId(), "/" + e.getFilePath(), e.getPosition()));
        }
        return out;
    }

    @Transactional
    public void delete(Integer itemId, Integer pictureId) {
        var pic = picRepo.findById(pictureId).orElseThrow(() -> new ItemNotFoundException("Picture not found"));
        if (!pic.getSaleItem().getId().equals(itemId)) throw new ItemNotFoundException("Picture not found");
        storage.deleteIfExists(pic.getFilePath());
        picRepo.delete(pic);
        var remain = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
        for (int i=0;i<remain.size();i++) remain.get(i).setPosition(i);
    }

}

