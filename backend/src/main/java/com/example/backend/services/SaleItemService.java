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
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.backend.utils.PictureNameUtill.canonicalName;
import static com.example.backend.utils.PictureNameUtill.getExt;

@Service
public class SaleItemService {
    @Autowired
    private SaleItemRepository saleItemRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private SaleItemPictureRepository picRepo;
    @Autowired
    private FileStorage storage;
    @Autowired
    private ModelMapper modelMapper;

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

    public Page<SaleItem> findAllSaleItemsPage(
            List<String> filterBrands,
            Integer page,
            Integer size,
            String sortField,
            String sortDirection,
            Double lowerPrice,
            Double upperPrice,
            List<Integer> storageSizes) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection),
                        sortField != null ? sortField : "createdOn")
                .and(Sort.by(Sort.Direction.ASC, "id"));
        Pageable pageable = PageRequest.of(page, size, sort);
       if(CollectionUtils.isEmpty(filterBrands)){
           filterBrands = null;
       }
       if(CollectionUtils.isEmpty(storageSizes)){
           storageSizes = null;
       }
        return saleItemRepository.findByFiltersWithBrand(filterBrands, lowerPrice, upperPrice, storageSizes,pageable);
    }

    @Transactional
    public SaleItemDto.GetSaleItemDto getSaleItemDto(Integer id) {
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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto> getSaleItemImages(Integer saleItemId) {
        var saleItem = saleItemRepository.findByIdWithBrand(saleItemId)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));

        return saleItem.getPictures().stream()
                .sorted(Comparator.comparingInt(SaleItemPicture::getPosition))
                .map(pic -> {
                    var dto = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
                    dto.setFileName(pic.getFileName());
                    dto.setImageViewOrder(pic.getPosition() + 1);
                    return dto;
                })
                .toList();
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
            var ext = getExt(file.getOriginalFilename());

            int order1based = position + 1;

            String newFileName = canonicalName(item.getId(), order1based, ext);
            String newPath = storage.renameSaleItemFile(item.getId(), stored.getFileName(), newFileName);

            var pic = new SaleItemPicture();
            pic.setSaleItem(item);
            pic.setFileName(newFileName);
            pic.setFilePath(newPath);
            pic.setPosition(position); // 0..3
            picRepo.save(pic);

            position++;
        }

        return sendV2Response(item.getId());
    }

    @org.springframework.transaction.annotation.Transactional
    public SaleItemV2Dto.SaleItemV2Response updateSaleItemWithImages(
            Integer itemId,
            SaleItemV2Dto.SaleItemWithImageInfo req
    ) throws IOException {

        var infos = Optional.ofNullable(req.getImageInfos()).orElse(List.of());
        var existingPics = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

        // --- DELETE ---
        var deleteIds = infos.stream()
                .filter(i -> i.getStatus() == ImageStatus.DELETE)
                .map(SaleItemV2Dto.SaleItemImageRequest::getPictureId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        var remainingPics = existingPics.stream()
                .filter(p -> !deleteIds.contains(p.getId()))
                .collect(Collectors.toList());

        existingPics.stream()
                .filter(p -> deleteIds.contains(p.getId()))
                .forEach(p -> storage.deleteIfExists(p.getFilePath()));

        if (!deleteIds.isEmpty()) {
            picRepo.deleteAll(
                    existingPics.stream().filter(p -> deleteIds.contains(p.getId())).toList()
            );
            picRepo.flush();
        }

        // --- ORDER (MOVE/ONLINE) ---
        Map<Integer, Integer> desiredOrder = new HashMap<>();
        for (var i : infos) {
            if ((i.getStatus() == ImageStatus.MOVE || i.getStatus() == ImageStatus.ONLINE)
                    && i.getPictureId() != null && i.getOrder() != null) {
                int order = Math.max(1, Math.min(4, i.getOrder()));
                desiredOrder.put(i.getPictureId(), order); // 1-based
            }
        }

        var withOrder = remainingPics.stream()
                .filter(p -> desiredOrder.containsKey(p.getId()))
                .sorted(Comparator.comparingInt(p -> desiredOrder.get(p.getId()))) // 1..4
                .collect(Collectors.toList());

        var withoutOrder = remainingPics.stream()
                .filter(p -> !desiredOrder.containsKey(p.getId()))
                .collect(Collectors.toList());

        var finalPictures = new ArrayList<SaleItemPicture>();
        finalPictures.addAll(withOrder);
        finalPictures.addAll(withoutOrder);

        if (!remainingPics.isEmpty()) {
            picRepo.deleteAll(remainingPics);
            picRepo.flush();
        }

        int position = 0; // 0-based
        for (var pic : finalPictures) {
            var newPic = new SaleItemPicture();
            newPic.setSaleItem(saleItemRepository.getReferenceById(itemId));
            newPic.setFileName(pic.getFileName());    // เดี๋ยวไปรีเนมท้าย ๆ
            newPic.setFilePath(pic.getFilePath());
            newPic.setPosition(position++);
            picRepo.save(newPic);
        }

        for (var i : infos) {
            if (i.getStatus() == ImageStatus.NEW) {
                var f = i.getImageFile();
                if (f == null || f.isEmpty())
                    throw new IllegalArgumentException("imageFile is required for NEW");
                if (position >= 4)
                    throw new IllegalStateException("Maximum 4 pictures are allowed.");

                var saved = storage.storeSaleItemFile(itemId, f);

                int order1based = position + 1;
                String ext = getExt(f.getOriginalFilename());
                String newName = canonicalName(itemId, order1based, ext);

                String newPath = storage.renameSaleItemFile(itemId, saved.getFileName(), newName);

                var newPic = new SaleItemPicture();
                newPic.setSaleItem(saleItemRepository.getReferenceById(itemId));
                newPic.setFileName(newName);
                newPic.setFilePath(newPath);
                newPic.setPosition(position++);
                picRepo.save(newPic);
            }
        }

        picRepo.flush();

        var normalized = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
        for (int idx = 0; idx < normalized.size(); idx++) {
            normalized.get(idx).setPosition(idx);
        }
        picRepo.flush();

        for (var p : normalized) {
            int order1based = p.getPosition() + 1;
            String ext = getExtFromFileName(p.getFileName());
            String desired = canonicalName(itemId, order1based, ext);
            if (!desired.equals(p.getFileName())) {
                String newPath = storage.renameSaleItemFile(itemId, p.getFileName(), desired);
                p.setFileName(desired);
                p.setFilePath(newPath);
            }
        }
        picRepo.flush();

        return sendV2Response(itemId);
    }

    @Transactional
    public SaleItemV2Dto.SaleItemV2Response deleteSaleItemWithImages(Integer itemId, SaleItemV2Dto.DeletePicturesRequest req) {
        var ids = Optional.ofNullable(req.pictureIds()).orElse(List.of());
        if (ids.isEmpty()) return sendV2Response(itemId);

        var pics = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
        if (pics.isEmpty()) return sendV2Response(itemId);

        for (var p : pics) {
            if (ids.contains(p.getId())) {
                storage.deleteIfExists(p.getFilePath());
                picRepo.delete(p);
            }
        }
        picRepo.flush();

        var remain = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
        for (int i = 0; i < remain.size(); i++) remain.get(i).setPosition(i);
        picRepo.flush();

        return sendV2Response(itemId);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public SaleItemV2Dto.SaleItemV2Response sendV2Response(Integer saleItemId) {
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

    private static String getExtFromFileName(String fileName) {
        if (fileName == null) return "jpg";
        int dot = fileName.lastIndexOf('.');
        return (dot >= 0) ? fileName.substring(dot + 1).toLowerCase() : "jpg";
    }

}