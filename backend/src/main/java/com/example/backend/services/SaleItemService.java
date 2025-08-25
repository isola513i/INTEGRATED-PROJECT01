package com.example.backend.services;

import com.example.backend.dtos.ImageStatus;
import com.example.backend.dtos.SaleItemDto;
import com.example.backend.dtos.SaleItemV2Dto;
import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import com.example.backend.entities.SaleItemPicture;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
import com.example.backend.repositories.SaleItemPictureRepository;
import com.example.backend.repositories.SaleItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SaleItemService {

    private static final int MAX_IMAGES = 4;
    private static final String CANON_EXT = "jpg";

    @Autowired
    private SaleItemRepository saleItemRepo;
    @Autowired
    private BrandRepository brandRepo;
    @Autowired
    private SaleItemPictureRepository pictureRepo;
    @Autowired
    private FileStorage fileStorage;

    @PersistenceContext
    private EntityManager em;


    @Transactional(readOnly = true)
    public List<SaleItem> allSaleItems() {
        return saleItemRepo.findAllWithBrandOrderByCreatedOnAscIdAsc();
    }

    public void deleteSaleItem(Integer id) {
        if (saleItemRepo.existsById(id)) {
            saleItemRepo.deleteById(id);
        } else throw new ItemNotFoundException("SaleItem not found for this id :: " + id);
    }

    @Transactional
    public SaleItem updateSaleItem(Integer id, SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        SaleItem saleItem = saleItemRepo.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
        Brand brand = brandRepo.findById(saleItemDto.getBrand().getId()).orElseThrow(
                () -> new ItemNotFoundException("Brand not found for this id :: " + saleItemDto.getBrand().getId()));
        saleItem.setModel(saleItemDto.getModel());
        saleItem.setBrand(brand);
        saleItem.setDescription(saleItemDto.getDescription());
        saleItem.setPrice(saleItemDto.getPrice());
        saleItem.setRamGb(saleItemDto.getRamGb());
        saleItem.setScreenSizeInch(saleItemDto.getScreenSizeInch());
        saleItem.setQuantity(saleItemDto.getQuantity());
        saleItem.setStorageGb(saleItemDto.getStorageGb());
        saleItem.setColor(saleItemDto.getColor());

        SaleItem updateItem = saleItemRepo.saveAndFlush(saleItem);
        em.refresh(updateItem);
        return saleItemRepo.findById(updateItem.getId()).orElseThrow();
    }

    @Transactional
    public SaleItem addSaleItem(SaleItem saleItem) {
        if (saleItem.getBrand() == null || saleItem.getBrand().getId() == null) {
            throw new IllegalArgumentException("Brand id must not be null");
        }
        Brand brand = brandRepo.
                findById(saleItem.getBrand().getId()).orElseThrow(
                        () -> new ItemNotFoundException("Brand not found for this id :: "
                                + saleItem.getBrand().getId()));
        saleItem.setBrand(brand);
        SaleItem savedItem = saleItemRepo.saveAndFlush(saleItem);
        em.refresh(savedItem);
        return saleItemRepo.findById(savedItem.getId()).orElseThrow();
    }

    @Transactional(readOnly = true)
    public Page<SaleItem> findAllSaleItemsPage(
            List<String> filterBrands,
            Integer page,
            Integer size,
            String sortField,
            String sortDirection,
            Double lowerPrice,
            Double upperPrice,
            List<Integer> storageSizes,
            String search
    ) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection),
                        sortField != null ? sortField : "createdOn")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page, size, sort);
        if(CollectionUtils.isEmpty(filterBrands)){
            filterBrands = null;
        }
        boolean searchNullStorage = storageSizes != null && storageSizes.contains(-1);

        if (searchNullStorage) {
            storageSizes.remove(Integer.valueOf(-1));
        }

        if (CollectionUtils.isEmpty(storageSizes)) {
            storageSizes = null;
        }

        return saleItemRepo.findByAdvancedFilters(
                filterBrands,
                lowerPrice,
                upperPrice,
                storageSizes,
                searchNullStorage,
                search,
                pageable
        );
    }

    @Transactional(readOnly = true)
    public SaleItemDto.GetSaleItemDto getSaleItemDetail(Integer id) {
        var s = saleItemRepo.findByIdWithBrand(id)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
        var d = new SaleItemDto.GetSaleItemDto();
        d.setId(s.getId());
        d.setModel(s.getModel());
        d.setBrandId(s.getBrand().getId());
        d.setBrandName(s.getBrand().getName());
        d.setDescription(s.getDescription());
        d.setPrice(s.getPrice());
        d.setRamGb(s.getRamGb());
        d.setScreenSizeInch(s.getScreenSizeInch());
        d.setQuantity(s.getQuantity());
        d.setStorageGb(s.getStorageGb());
        d.setColor(s.getColor());
        d.setCreatedOn(s.getCreatedOn());
        d.setUpdatedOn(s.getUpdatedOn());
        return d;
    }

    @Transactional(readOnly = true)
    public SaleItemV2Dto.SaleItemV2Response getSaleItemDetailV2(Integer saleItemId) {
        var saleItem = saleItemRepo.findByIdWithBrand(saleItemId)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));

        var response = new SaleItemV2Dto.SaleItemV2Response();
        response.setId(saleItem.getId());
        response.setModel(saleItem.getModel());
        response.setBrandName(saleItem.getBrand().getName());
        response.setDescription(saleItem.getDescription());
        response.setPrice(saleItem.getPrice());
        response.setRamGb(saleItem.getRamGb());
        response.setScreenSizeInch(saleItem.getScreenSizeInch());
        response.setQuantity(saleItem.getQuantity());
        response.setStorageGb(saleItem.getStorageGb());
        response.setColor(saleItem.getColor());
        var imageResponses = saleItem.getPictures().stream()
                .sorted(Comparator.comparingInt(SaleItemPicture::getPosition))
                .map(pic -> {
                    var dto = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
                    dto.setFileName(pic.getFileName());
                    dto.setImageViewOrder(pic.getPosition() + 1);
                    return dto;
                })
                .toList();

        response.setSaleItemImages(imageResponses);
        response.setCreatedOn(saleItem.getCreatedOn());
        response.setUpdatedOn(saleItem.getUpdatedOn());
        return response;
    }

    @Transactional
    public SaleItemV2Dto.SaleItemV2Response createSaleItemWithImages(SaleItemV2Dto.SaleItemWithImageInfo req) throws IOException {
        var s = req.getSaleItem();
        if (s == null) throw new IllegalArgumentException("saleItem is required");
        if (s.getBrand() == null || s.getBrand().getId() == null)
            throw new IllegalArgumentException("saleItem.brand.id is required");

        var brand = brandRepo.findById(s.getBrand().getId())
                .orElseThrow(() -> new ItemNotFoundException("Brand not found"));

        var item = new SaleItem();
        item.setModel(s.getModel());
        item.setBrand(brand);
        item.setDescription(s.getDescription());
        item.setPrice(s.getPrice());
        item.setRamGb(s.getRamGb());
        item.setScreenSizeInch(s.getScreenSizeInch());
        item.setQuantity(s.getQuantity());
        item.setStorageGb(s.getStorageGb());
        item.setColor(s.getColor());
        item = saleItemRepo.saveAndFlush(item);

        var infos = Optional.ofNullable(req.getImageInfos()).orElse(List.of());
        if (infos.size() > 4) throw new IllegalArgumentException("Maximum 4 pictures are allowed.");

        int position = 0;
        for (var info : infos.stream()
                .sorted(Comparator.comparing(i -> Optional.ofNullable(i.getOrder()).orElse(999)))
                .toList()) {

            if (info.getStatus() != ImageStatus.NEW) continue;

            var file = info.getImageFile();
            if (file == null || file.isEmpty())
                throw new IllegalArgumentException("imageInfos.imageFile is required for NEW");

            var stored = fileStorage.storeSaleItemFile(item.getId(), file);
            int order1based = position + 1;
            String newFileName = buildCanonicalName(item.getId(), order1based, "jpg");
            String newPath = fileStorage.renameSaleItemFile(item.getId(), stored.getFileName(), newFileName);

            var pic = new SaleItemPicture();
            pic.setSaleItem(item);
            pic.setFileName(newFileName);
            pic.setFilePath(newPath);
            pic.setPosition(position);
            pictureRepo.save(pic);
            position++;
        }

        return getSaleItemDetailV2(item.getId());
    }

    @Transactional
    public SaleItemV2Dto.SaleItemV2Response updateSaleItemWithImages(
            Integer itemId,
            SaleItemV2Dto.SaleItemWithImageInfo req
    ) throws IOException {

        var s = req.getSaleItem();
        if (s != null) {
            var item = saleItemRepo.findById(itemId)
                    .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
            if (s.getBrand() != null && s.getBrand().getId() != null) {
                var brand = brandRepo.findById(s.getBrand().getId())
                        .orElseThrow(() -> new ItemNotFoundException("Brand not found"));
                item.setBrand(brand);
            }
            if (s.getModel() != null) item.setModel(s.getModel());
            if (s.getDescription() != null) item.setDescription(s.getDescription());
            if (s.getPrice() != null) item.setPrice(s.getPrice());
            if (s.getRamGb() != null) item.setRamGb(s.getRamGb());
            if (s.getScreenSizeInch() != null) item.setScreenSizeInch(s.getScreenSizeInch());
            if (s.getQuantity() != null) item.setQuantity(s.getQuantity());
            if (s.getStorageGb() != null) item.setStorageGb(s.getStorageGb());
            if (s.getColor() != null) item.setColor(s.getColor());
            saleItemRepo.save(item);
        }

        var infos = Optional.ofNullable(req.getImageInfos()).orElse(List.of());
        applyReorderAndNewWithSlots(itemId, infos);

        normalizeFileNamesToCanonical(itemId);

        return getSaleItemDetailV2(itemId);
    }

    @Transactional(readOnly = true)
    public ImageMeta loadImage(Integer saleItemId, String fileName) throws IOException {
        var pic = pictureRepo.findBySaleItemIdAndFileName(saleItemId, fileName)
                .orElseThrow(() -> new ItemNotFoundException("Image not found"));

        // Let FileStorage send back Resource
        FileSystemResource fsr = fileStorage.loadSaleItemFile(saleItemId, fileName);
        if (!fsr.exists() || !fsr.isReadable()) {
            throw new ItemNotFoundException("Image file missing on disk");
        }

        Path path = fsr.getFile().toPath();
        byte[] bytes = Files.readAllBytes(path);
        Resource body = new ByteArrayResource(bytes);

        // Standard lookup by extension
        String ext = "";
        int dot = fileName.lastIndexOf('.');
        if (dot >= 0 && dot < fileName.length() - 1) {
            ext = fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
        }

        MediaType mediaType = switch (ext) {
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png"         -> MediaType.IMAGE_PNG;
            case "webp"        -> MediaType.parseMediaType("image/webp");
            default            -> MediaType.APPLICATION_OCTET_STREAM;
        };

        long size = Files.size(path);
        FileTime mtime = Files.getLastModifiedTime(path);
        String etag = "\"" + size + "-" + mtime.toMillis() + "\"";

        return new ImageMeta(body, mediaType, etag);
    }

    // payload, mediaType, etag
    public record ImageMeta(Resource body, MediaType mediaType, String etag) {}

    @Transactional
    public void deleteSaleItemAndImages(Integer itemId) {
        var pics = pictureRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        for (var p : pics) {
            fileStorage.deleteIfExists(p.getFilePath());
        }

        if (!pics.isEmpty()) {
            pictureRepo.deleteAllInBatch(pics);
            pictureRepo.flush();
        }

        if (saleItemRepo.existsById(itemId)) {
            saleItemRepo.deleteById(itemId);
        } else {
            throw new ItemNotFoundException("SaleItem not found for this id :: " + itemId);
        }

        fileStorage.deleteItemDirectory(itemId);
    }

    @Transactional
    public void ensureItemExists(Integer id) {
        saleItemRepo.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
    }

    // Manage Delete, Reorder, New with slots (0..3)
    private void applyReorderAndNewWithSlots(
            Integer itemId,
            List<SaleItemV2Dto.SaleItemImageRequest> infos
    ) throws IOException {

        var existing = pictureRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        var deleteNames = infos.stream()
                .filter(i -> i.getStatus() == ImageStatus.DELETE)
                .map(SaleItemV2Dto.SaleItemImageRequest::getFileName)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Integer> deletedPositions = List.of();
        if (!deleteNames.isEmpty()) {
            var toDelete = existing.stream()
                    .filter(p -> deleteNames.contains(p.getFileName()))
                    .toList();

            deletedPositions = toDelete.stream()
                    .map(SaleItemPicture::getPosition)
                    .sorted()
                    .toList();

            for (var p : toDelete) fileStorage.deleteIfExists(p.getFilePath());
            if (!toDelete.isEmpty()) {
                pictureRepo.deleteAll(toDelete);
                pictureRepo.flush();
            }
        }

        existing = pictureRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        Map<String, Integer> orderExisting = new HashMap<>(); // fileName -> order(1..4)
        record NewReq(MultipartFile file, Integer order) {}
        List<NewReq> newReqs = new ArrayList<>();

        for (var info : infos) {
            if ((info.getStatus() == ImageStatus.MOVE || info.getStatus() == ImageStatus.ONLINE)
                    && info.getFileName() != null && info.getOrder() != null) {
                orderExisting.put(info.getFileName(), clampOrder(info.getOrder()));
            } else if (info.getStatus() == ImageStatus.NEW) {
                if (info.getImageFile() == null || info.getImageFile().isEmpty())
                    throw new IllegalArgumentException("Image file is required for NEW");
                newReqs.add(new NewReq(info.getImageFile(),
                        info.getOrder() == null ? null : clampOrder(info.getOrder())));
            }
        }

        if (existing.size() + newReqs.size() > 4) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Maximum 4 pictures are allowed.");
        }

        SaleItemPicture[] slots = new SaleItemPicture[4];
        boolean[] used = new boolean[4];

        var existingWithOrder = existing.stream()
                .filter(p -> orderExisting.containsKey(p.getFileName()))
                .sorted(Comparator.comparingInt(p -> orderExisting.get(p.getFileName())))
                .toList();
        for (var p : existingWithOrder) {
            int pos = orderExisting.get(p.getFileName()) - 1;
            pos = placeToNearestFree(pos, used);
            slots[pos] = p; used[pos] = true;
        }

        record PendingNew(MultipartFile file, int pos) {}
        List<PendingNew> pendingNew = new ArrayList<>();
        var newWithOrder = newReqs.stream().filter(n -> n.order() != null).toList();
        for (var n : newWithOrder) {
            int pos = placeToNearestFree(n.order() - 1, used);
            pendingNew.add(new PendingNew(n.file(), pos));
            used[pos] = true;
        }

        var existingNoOrder = existing.stream()
                .filter(p -> !orderExisting.containsKey(p.getFileName()))
                .sorted(Comparator.comparingInt(SaleItemPicture::getPosition))
                .toList();

        for (var p : existingNoOrder) {
            int pos = p.getPosition();
            if (pos < 0 || pos > 3) continue;
            if (!used[pos]) {
                slots[pos] = p; used[pos] = true;
            } else {
                int alt = firstFree(used);
                if (alt == -1) throw new IllegalStateException("No free slot");
                slots[alt] = p; used[alt] = true;
            }
        }

        var freed = new ArrayDeque<>(deletedPositions);
        var newNoOrder = newReqs.stream().filter(n -> n.order() == null).toList();
        for (var n : newNoOrder) {
            Integer pos = freed.pollFirst();
            if (pos == null) pos = firstFree(used);
            if (pos == -1) throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST,
                    "Maximum 4 pictures are allowed.");
            pendingNew.add(new PendingNew(n.file(), pos));
            used[pos] = true;
        }

        Map<Integer, Integer> idToPos = new LinkedHashMap<>();
        for (int pos = 0; pos < 4; pos++) {
            var slot = slots[pos];
            if (slot != null && slot.getId() != null) {
                idToPos.put(slot.getId(), pos);
            }
        }
        if (idToPos.size() != existing.size()) {
            throw new IllegalStateException("Reorder mismatch: existing ids not complete.");
        }

        em.flush();
        em.clear();

        em.createNativeQuery("UPDATE sale_item_pictures SET position = position + 10 WHERE saleItemId = :id")
                .setParameter("id", itemId)
                .setFlushMode(jakarta.persistence.FlushModeType.COMMIT)
                .executeUpdate();

        updatePositionsCaseWhen(itemId, idToPos);

        for (var n : pendingNew) {
            var saved = fileStorage.storeSaleItemFile(itemId, n.file());
            var pic = new SaleItemPicture();
            pic.setSaleItem(saleItemRepo.getReferenceById(itemId));
            pic.setFileName(saved.getFileName());
            pic.setFilePath(saved.getPath());
            pic.setPosition(n.pos());
            pictureRepo.save(pic);
        }
        pictureRepo.flush();
    }

    // UPDATE positions with SQL CASE WHEN
    @Transactional
    protected void updatePositionsCaseWhen(Integer itemId, Map<Integer, Integer> idToPos) {
        if (idToPos == null || idToPos.isEmpty()) return;

        StringBuilder caseSql = new StringBuilder("UPDATE sale_item_pictures SET position = CASE pictureId ");
        StringBuilder inList  = new StringBuilder();
        boolean first = true;

        for (var e : idToPos.entrySet()) {
            caseSql.append(" WHEN ").append(e.getKey()).append(" THEN ").append(e.getValue());
            if (!first) inList.append(",");
            inList.append(e.getKey());
            first = false;
        }
        caseSql.append(" END WHERE saleItemId = ").append(itemId)
                .append(" AND pictureId IN (").append(inList).append(")");

        em.createNativeQuery(caseSql.toString())
                .setFlushMode(jakarta.persistence.FlushModeType.COMMIT)
                .executeUpdate();
    }

    // Rename files to {itemId}.{order}.jpg
    @Transactional
    protected void normalizeFileNamesToCanonical(Integer itemId) throws IOException {
        var all = pictureRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        record Plan(SaleItemPicture pic, String from, String tmp, String to) {}
        List<Plan> plans = new ArrayList<>();

        for (var pic : all) {
            int order = pic.getPosition() + 1;
            String target = buildCanonicalName(itemId, order, CANON_EXT);
            if (target.equalsIgnoreCase(pic.getFileName())) continue;

            String tmp = pic.getFileName() + "." + UUID.randomUUID().toString().replace("-", "") + ".swap";
            plans.add(new Plan(pic, pic.getFileName(), tmp, target));
        }
        if (plans.isEmpty()) return;

        // ก้าว 1: rename -> tmp
        for (var p : plans) {
            String newPath = fileStorage.renameSaleItemFile(itemId, p.from(), p.tmp());
            p.pic().setFileName(p.tmp());
            p.pic().setFilePath(newPath);
        }
        pictureRepo.saveAll(all);
        pictureRepo.flush();

        // ก้าว 2: tmp -> canonical
        for (var p : plans) {
            String newPath = fileStorage.renameSaleItemFile(itemId, p.tmp(), p.to());
            p.pic().setFileName(p.to());
            p.pic().setFilePath(newPath);
        }
        pictureRepo.saveAll(all);
        pictureRepo.flush();
    }

    // Etc. helpers //
    private int clampOrder(int order) { return Math.max(1, Math.min(MAX_IMAGES, order)); }

    private int placeToNearestFree(int pos, boolean[] used) {
        if (!used[pos]) return pos;
        for (int i = 0; i < used.length; i++) if (!used[i]) return i;
        return pos;
    }

    private int firstFree(boolean[] used) {
        for (int i = 0; i < used.length; i++) if (!used[i]) return i;
        return -1;
    }

    private String buildCanonicalName(Integer itemId, int order1Based, String ext) {
        return itemId + "." + order1Based + "." + ext;
    }

    public List<Integer> getAllStorageSizes() {
        return saleItemRepo.findDistinctStorageSizes()
                .stream()
                .map(s -> s == null ? -1 : s)
                .sorted()
                .toList();
    }

}