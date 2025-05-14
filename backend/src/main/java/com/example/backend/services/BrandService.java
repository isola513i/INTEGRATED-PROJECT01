package com.example.backend.services;

import com.example.backend.entities.Brand;
import com.example.backend.dtos.BrandDto;
import java.time.Instant;
import com.example.backend.exceptions.DuplicateNameException;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(int id) {
        return brandRepository.findById(id).orElseThrow(() ->
                new ItemNotFoundException("Brand not found for this id :: "+ id));
    }
    public Brand updateBrand(int id,BrandDto.UpdateBrandDto request){
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Brand not found for this id :: " + id));

        boolean isDuplicate = brandRepository.existsByNameAndIdNot(request.getName().trim(), id);
        if (isDuplicate) {
            throw new DuplicateNameException("Duplicate name");
        }

        brand.setName(request.getName().trim());
        brand.setWebsiteUrl(request.getWebsiteUrl() != null ? request.getWebsiteUrl().trim() : null);
        brand.setCountryOfOrigin(request.getCountryOfOrigin() != null ? request.getCountryOfOrigin().trim() : null);
        brand.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        brand.setUpdatedOn(Instant.now());

        return brandRepository.save(brand);
    }

}
