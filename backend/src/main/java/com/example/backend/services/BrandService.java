package com.example.backend.services;

import com.example.backend.entities.Brand;
import com.example.backend.dtos.BrandDto;
import java.time.Instant;

import com.example.backend.exceptions.BrandHasSaleItemsException;
import com.example.backend.exceptions.DuplicateNameException;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
import com.example.backend.repositories.SaleItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private SaleItemRepository saleItemRepository;
    @Autowired
    private EntityManager entityManager;

//    public List<Brand> getAllBrands() {
//        return brandRepository.findAllByIsDeletedFalse();
//    }
    public List<Brand> getAllBrands() {
        return brandRepository.findAllByIsDeletedFalseOrderByCreatedOnAsc();
    }

    public BrandDto.GetBrandDto getBrandById(int id) {
        Brand brand= brandRepository.findById(id).orElseThrow(() ->
                new ItemNotFoundException("Brand not found for this id :: "+ id));

        int noOfSaleItems = saleItemRepository.countByBrandId(id);
        BrandDto.GetBrandDto dto = new BrandDto.GetBrandDto();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setWebsiteUrl(brand.getWebsiteUrl());
        dto.setCountryOfOrigin(brand.getCountryOfOrigin());
        dto.setIsActive(brand.getIsActive());
        dto.setNoOfSaleItems(noOfSaleItems);
        return dto;
    }

    @Transactional
    public  Brand addBrand(BrandDto.GetBrandDto brandDto) {
        brandDto.setId(null);
        if (brandDto == null) {
            throw new IllegalArgumentException("Request must not be null");    }
        String name = brandDto.getName() != null ? brandDto.getName().trim() : null;
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Brand name must not be empty");    }
        if (brandRepository.existsByName(name)) {
            throw new DuplicateNameException("Brand with name '" + name + "' already exists");    }

        Brand brand = new Brand();
        brand.setName(name);
        brand.setWebsiteUrl(brandDto.getWebsiteUrl() != null ? brandDto.getWebsiteUrl().trim() : null);
        brand.setCountryOfOrigin(brandDto.getCountryOfOrigin() != null ? brandDto.getCountryOfOrigin().trim() : null);
        brand.setIsActive(brandDto.getIsActive() != null ? brandDto.getIsActive() : true);
        Brand save = brandRepository.save(brand);
        entityManager.refresh(save);
        return save;
    }

    public Brand updateBrand(int id, BrandDto.UpdateBrandDto request) {
        Brand brand = brandRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ItemNotFoundException("Brand not found"));
        String trimmedName = request.getName() != null ? request.getName().trim() : null;
        if (trimmedName == null || trimmedName.isEmpty()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
        boolean isDuplicate = brandRepository
                .existsByNameAndIdNotAndIsDeletedFalse(trimmedName, id);
        if (isDuplicate) {
            throw new DuplicateNameException("Duplicate name");
        }
        brand.setName(trimmedName);
        brand.setWebsiteUrl(request.getWebsiteUrl() != null ? request.getWebsiteUrl().trim() : null);
        brand.setCountryOfOrigin(request.getCountryOfOrigin() != null ? request.getCountryOfOrigin().trim() : null);
        Boolean isActive = request.getIsActive();
        brand.setIsActive(isActive != null ? isActive : brand.getIsActive());
        brand.setUpdatedOn(Instant.now());
        return brandRepository.save(brand);
    }

    public void deleteBrand(Integer id){
        Brand brand = brandRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ItemNotFoundException("Brand not found"));
        if (saleItemRepository.existsByBrand_Id(id)) {
            throw new BrandHasSaleItemsException("Brand has sale item(s)");
        }
        brand.setIsDeleted(true);
        brandRepository.save(brand);
    }


}
