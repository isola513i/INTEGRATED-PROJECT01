package com.example.backend.services;

import com.example.backend.entities.Brand;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BrandService {
    private BrandRepository brandRepository;
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
    public Brand getBrandById(int id) {
        return brandRepository.findById(id).orElseThrow(() ->
                new ItemNotFoundException("Brand not found for this id :: "+ id));
    }



}
