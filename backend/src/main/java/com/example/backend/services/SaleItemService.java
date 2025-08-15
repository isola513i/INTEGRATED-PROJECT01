package com.example.backend.services;

import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
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


import java.util.List;

@Service
public class SaleItemService {
    @Autowired
    private SaleItemRepository saleItemRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private ModelMapper modelMapper;

    public List<SaleItem> allSaleItems() {
        return saleItemRepository.findAllWithBrandOrderByCreatedOnAscIdAsc();
    }

    public SaleItem findSaleItemById(Integer id) {
        return saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
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
}