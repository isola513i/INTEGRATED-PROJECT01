package com.example.backend.services;

import com.example.backend.dtos.PictureDto;
import com.example.backend.dtos.SavePicturesRequest;
import com.example.backend.entities.SaleItemPicture;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.SaleItemPictureRepository;
import com.example.backend.repositories.SaleItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

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
        if (current + files.size() > MAX_PICS) throw new IllegalArgumentException("Maximum 4 pictures are allowed.");

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

    @Transactional
    public List<PictureDto> saveState(Integer itemId, SavePicturesRequest req) {
        var current = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
        var incoming = (req.pictureIds() == null) ? List.<Integer>of() : req.pictureIds();

        var currentIds = current.stream().map(SaleItemPicture::getId).collect(Collectors.toSet());
        if (incoming.size() != new HashSet<>(incoming).size())
            throw new IllegalArgumentException("Invalid order: duplicate ids");
        if (!currentIds.containsAll(incoming))
            throw new IllegalArgumentException("Invalid order: contains unknown ids");

        if (incoming.size() < current.size()) {
            var keep = new HashSet<>(incoming);
            for (var pic : current) {
                if (!keep.contains(pic.getId())) {
                    storage.deleteIfExists(pic.getFilePath());
                    picRepo.delete(pic);
                }
            }
            picRepo.flush();
        }

        if (incoming.isEmpty()) return List.of();

        String placeholders = incoming.stream().map(i -> "?").collect(Collectors.joining(","));
        String sql = "UPDATE sale_item_pictures " +
                "SET position = FIELD(pictureId, " + placeholders + ") - 1 " +
                "WHERE saleItemId = ? AND pictureId IN (" + placeholders + ")";

        var q = em.createNativeQuery(sql);
        int idx = 1;
        for (Integer id : incoming) q.setParameter(idx++, id);
        q.setParameter(idx++, itemId);
        for (Integer id : incoming) q.setParameter(idx++, id);
        q.executeUpdate();

        return list(itemId);
    }

    @PersistenceContext
    private EntityManager em;

}

