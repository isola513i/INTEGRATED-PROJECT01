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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SaleItemService {
    private final SaleItemRepository saleItemRepository;

    private final BrandRepository brandRepository;

    private final EntityManager entityManager;

    private final SaleItemPictureRepository picRepo;

    private final FileStorage storage;

    public SaleItemService(SaleItemRepository saleItemRepository, BrandRepository brandRepository, EntityManager entityManager, SaleItemPictureRepository picRepo, FileStorage storage) {
        this.saleItemRepository = saleItemRepository;
        this.brandRepository = brandRepository;
        this.entityManager = entityManager;
        this.picRepo = picRepo;
        this.storage = storage;
    }

    @PersistenceContext
    private EntityManager em;

    @Transactional(readOnly = true)
    public List<SaleItem> allSaleItems() {
        return saleItemRepository.findAllWithBrandOrderByCreatedOnAscIdAsc();
    }

    public void deleteSaleItem(Integer id) {
        if (saleItemRepository.existsById(id)) {
            saleItemRepository.deleteById(id);
        } else throw new ItemNotFoundException("SaleItem not found for this id :: " + id);
    }

    @Transactional
    public SaleItem updateSaleItem(Integer id, SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        SaleItem saleItem = saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
        Brand brand = brandRepository.findById(saleItemDto.getBrand().getId()).orElseThrow(
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

        SaleItem updateItem = saleItemRepository.saveAndFlush(saleItem);
        entityManager.refresh(updateItem);
        return saleItemRepository.findById(updateItem.getId()).orElseThrow();
    }

    @Transactional
    public SaleItem addSaleItem(SaleItem saleItem) {
        if (saleItem.getBrand() == null || saleItem.getBrand().getId() == null) {
            throw new IllegalArgumentException("Brand id must not be null");
        }
        Brand brand = brandRepository.
                findById(saleItem.getBrand().getId()).orElseThrow(
                        () -> new ItemNotFoundException("Brand not found for this id :: "
                                + saleItem.getBrand().getId()));
        saleItem.setBrand(brand);
        SaleItem savedItem = saleItemRepository.saveAndFlush(saleItem);
        entityManager.refresh(savedItem);
        return saleItemRepository.findById(savedItem.getId()).orElseThrow();
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

        return saleItemRepository.findByAdvancedFilters(
                filterBrands,
                lowerPrice,
                upperPrice,
                storageSizes,
                searchNullStorage,
                search,
                pageable
        );

//        return saleItemRepository.findByFiltersWithBrand(filterBrands, lowerPrice, upperPrice, storageSizes,pageable);
    }

    @Transactional(readOnly = true)
    public SaleItemDto.GetSaleItemDto getSaleItemDetail(Integer id) {
        var s = saleItemRepository.findByIdWithBrand(id)
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
        var saleItem = saleItemRepository.findByIdWithBrand(saleItemId)
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

        var brand = brandRepository.findById(s.getBrand().getId())
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
        item = saleItemRepository.saveAndFlush(item);

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

            var stored = storage.storeSaleItemFile(item.getId(), file);
            int order1based = position + 1;
            String newFileName = canonicalName(item.getId(), order1based, "jpg");
            String newPath = storage.renameSaleItemFile(item.getId(), stored.getFileName(), newFileName);

            var pic = new SaleItemPicture();
            pic.setSaleItem(item);
            pic.setFileName(newFileName);
            pic.setFilePath(newPath);
            pic.setPosition(position); // 0..3
            picRepo.save(pic);

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
            var item = saleItemRepository.findById(itemId)
                    .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
            if (s.getBrand() != null && s.getBrand().getId() != null) {
                var brand = brandRepository.findById(s.getBrand().getId())
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
            saleItemRepository.save(item);
        }

        var infos = Optional.ofNullable(req.getImageInfos()).orElse(List.of());
        applyReorderAndNewWithSlots(itemId, infos);

        normalizeAndRenameFiles(itemId);

        return getSaleItemDetailV2(itemId);
    }

    @Transactional
    public void deleteSaleItemAndImages(Integer itemId) {
        var pics = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        for (var p : pics) {
            storage.deleteIfExists(p.getFilePath());
        }

        if (!pics.isEmpty()) {
            picRepo.deleteAllInBatch(pics);
            picRepo.flush();
        }

        if (saleItemRepository.existsById(itemId)) {
            saleItemRepository.deleteById(itemId);
        } else {
            throw new ItemNotFoundException("SaleItem not found for this id :: " + itemId);
        }

        storage.deleteItemDirectory(itemId);
    }

    @Transactional
    public void ensureItemExists(Integer id) {
        saleItemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
    }

    private void applyReorderAndNewWithSlots(
            Integer itemId,
            List<SaleItemV2Dto.SaleItemImageRequest> infos
    ) throws IOException {

        var existing = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

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

            for (var p : toDelete) storage.deleteIfExists(p.getFilePath());
            if (!toDelete.isEmpty()) {
                picRepo.deleteAll(toDelete);
                picRepo.flush();
            }
        }

        existing = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

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

        updatePicturePositionsAtomic(itemId, idToPos);

        for (var n : pendingNew) {
            var saved = storage.storeSaleItemFile(itemId, n.file());
            var pic = new SaleItemPicture();
            pic.setSaleItem(saleItemRepository.getReferenceById(itemId));
            pic.setFileName(saved.getFileName());
            pic.setFilePath(saved.getPath());
            pic.setPosition(n.pos());
            picRepo.save(pic);
        }
        picRepo.flush();
    }

    @Transactional
    protected void updatePicturePositionsAtomic(Integer itemId, Map<Integer, Integer> idToPos) {
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

    private int clampOrder(int order) { return Math.max(1, Math.min(4, order)); }

    private int placeToNearestFree(int pos, boolean[] used) {
        if (!used[pos]) return pos;
        for (int i = 0; i < used.length; i++) {
            if (!used[i]) return i;
        }
        return pos;
    }

    private int firstFree(boolean[] used) {
        for (int i = 0; i < used.length; i++) if (!used[i]) return i;
        return -1;
    }

    private void normalizeAndRenameFiles(Integer itemId) throws IOException {
        var allPics = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        record Plan(SaleItemPicture pic, String from, String tmp, String to) {}
        List<Plan> plans = new ArrayList<>();

        for (var pic : allPics) {
            int displayOrder = pic.getPosition() + 1;
            String target = canonicalName(itemId, displayOrder, "jpg");
            String current = pic.getFileName();
            if (target.equals(current)) continue;
            String tmp = current + "." + UUID.randomUUID().toString().replace("-", "") + ".swap";
            plans.add(new Plan(pic, current, tmp, target));
        }

        if (plans.isEmpty()) return;
        for (var p : plans) {
            String newPath = storage.renameSaleItemFile(itemId, p.from(), p.tmp());
            p.pic().setFileName(p.tmp());
            p.pic().setFilePath(newPath);
        }
        picRepo.saveAll(allPics);
        picRepo.flush();

        for (var p : plans) {
            String newPath = storage.renameSaleItemFile(itemId, p.tmp(), p.to());
            p.pic().setFileName(p.to());
            p.pic().setFilePath(newPath);
        }
        picRepo.saveAll(allPics);
        picRepo.flush();
    }

    private String canonicalName(Integer itemId, int order, String extension) {
        return itemId + "." + order + "." + extension;
    }

    public List<Integer> getAllStorageSizes() {
        return saleItemRepository.findDistinctStorageSizes()
                .stream()
                .map(s -> s == null ? -1 : s)
                .sorted()
                .toList();
    }

}