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

import static com.example.backend.dtos.ImageStatus.NEW;

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

    //public SaleItem findSaleItemById(Integer id) {
    //    return saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
    //}

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

            if (info.getStatus() != NEW)
                continue;

            var file = info.getImageFile();
            if (file == null || file.isEmpty())
                throw new IllegalArgumentException("imageInfos.imageFile is required for NEW");

            var stored = storage.storeSaleItemFile(item.getId(), file);

            var pic = new SaleItemPicture();
            pic.setSaleItem(item);
            pic.setFileName(stored.getFileName());
            pic.setFilePath(stored.getPath());
            pic.setPosition(position++);
            picRepo.save(pic);
        }

        return sendV2Response(item.getId());
    }

    @Transactional
    public SaleItemV2Dto.SaleItemV2Response updateSaleItemWithImages(
            Integer itemId,
            SaleItemV2Dto.SaleItemWithImageInfo req
    ) throws IOException {

        var infos = Optional.ofNullable(req.getImageInfos()).orElse(List.of());

        var existingPics = picRepo.findBySaleItemIdOrderByPositionAsc(itemId);

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

        if (!existingPics.isEmpty()) {
            picRepo.deleteAll(existingPics);
            picRepo.flush(); // Force delete
        }

        Map<Integer, Integer> desiredOrder = new HashMap<>();
        for (var i : infos) {
            if ((i.getStatus() == ImageStatus.MOVE || i.getStatus() == ImageStatus.ONLINE)
                    && i.getPictureId() != null && i.getOrder() != null) {
                int order = Math.max(1, Math.min(4, i.getOrder()));
                desiredOrder.put(i.getPictureId(), order);
            }
        }

        var withOrder = remainingPics.stream()
                .filter(p -> desiredOrder.containsKey(p.getId()))
                .sorted(Comparator.comparingInt(p -> desiredOrder.get(p.getId())))
                .collect(Collectors.toList());

        var withoutOrder = remainingPics.stream()
                .filter(p -> !desiredOrder.containsKey(p.getId()))
                .collect(Collectors.toList());

        var finalPictures = new ArrayList<SaleItemPicture>();
        finalPictures.addAll(withOrder);
        finalPictures.addAll(withoutOrder);

        int position = 0;
        for (var pic : finalPictures) {
            var newPic = new SaleItemPicture();
            newPic.setSaleItem(saleItemRepository.getReferenceById(itemId));
            newPic.setFileName(pic.getFileName());
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
                var newPic = new SaleItemPicture();
                newPic.setSaleItem(saleItemRepository.getReferenceById(itemId));
                newPic.setFileName(saved.getFileName());
                newPic.setFilePath(saved.getPath());
                newPic.setPosition(position++);
                picRepo.save(newPic);
            }
        }

        picRepo.flush(); // Force save all changes

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

  //  @Transactional
//    public SaleItemV2Dto.SaleItemV2Response sendV2Response(Integer id) {
//        var s = saleItemRepository.findByIdWithBrand(id)
//                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));
//
//        var dto = new SaleItemV2Dto.SaleItemV2Response();
//        dto.setId(s.getId());
//        dto.setModel(s.getModel());
//        dto.setBrandName(s.getBrand().getName());
//        dto.setDescription(s.getDescription());
//        dto.setPrice(s.getPrice());
//        dto.setRamGb(s.getRamGb());
//        dto.setScreenSizeInch(s.getScreenSizeInch());
//        dto.setQuantity(s.getQuantity());
//        dto.setStorageGb(s.getStorageGb());
//        dto.setColor(s.getColor());
//        dto.setCreatedOn(s.getCreatedOn());
//        dto.setUpdatedOn(s.getUpdatedOn());
//
//        var pics = picRepo.findBySaleItemIdOrderByPositionAsc(id);
//        var images = pics.stream().map(p -> {
//            var i = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
//            i.setPictureId(p.getId());
//            i.setFileName(p.getFileName());
//            i.setImageViewOrder(p.getPosition() + 1);
//            return i;
//        }).toList();
//        dto.setSaleItemImages(images);
//        return dto;
//    }
  @Transactional
    public SaleItemV2Dto.SaleItemV2Response sendV2Response(Integer id) {
        var s = saleItemRepository.findByIdWithBrand(id)
                .orElseThrow(() -> new ItemNotFoundException("SaleItem not found"));

        var dto = new SaleItemV2Dto.SaleItemV2Response();
        dto.setId(s.getId());
        dto.setModel(s.getModel());
        dto.setBrandName(s.getBrand().getName());
        dto.setDescription(s.getDescription());
        dto.setPrice(s.getPrice());
        dto.setRamGb(s.getRamGb());
        dto.setScreenSizeInch(s.getScreenSizeInch());
        dto.setQuantity(s.getQuantity());
        dto.setStorageGb(s.getStorageGb());
        dto.setColor(s.getColor());
        dto.setCreatedOn(s.getCreatedOn());
        dto.setUpdatedOn(s.getUpdatedOn());

        var pics = picRepo.findBySaleItemIdOrderByPositionAsc(id);
        var images = pics.stream().map(p -> {
            var i = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
            i.setPictureId(p.getId());

            String originalFileName = p.getFileName();
            String extension = getFileExtension(originalFileName);
            String newFileName = id + "." + (p.getPosition() + 1) + extension;
            i.setFileName(newFileName);

            i.setImageViewOrder(p.getPosition() + 1);
            i.setImageUrl("/v2/sale-items/images/" + p.getId());
            return i;
        }).toList();
        dto.setSaleItemImages(images);
        return dto;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return ".jpg";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }

    public List<SaleItemPicture> findByItemOrdered(Integer itemId) {
        return picRepo.findBySaleItemIdOrderByPositionAsc(itemId);
    }

    public SaleItemPicture findImageById(Integer imageId) {
        return picRepo.findById(imageId).orElse(null);
    }
}