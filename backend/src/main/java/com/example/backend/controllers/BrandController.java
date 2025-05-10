package com.example.backend.controllers;

import com.example.backend.dtos.BrandDto;
import com.example.backend.services.BrandService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "${app.cors.allowedOrigins}")
@RestController
@RequestMapping("/itb-mshop/v1")
public class BrandController {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ListMapper listMapper;
    @Autowired
    private BrandService brandService;

    @GetMapping("/brands")
    public ResponseEntity<List<BrandDto.GetAllBrandDto>> getAllBrands() {
        return ResponseEntity.ok(listMapper.mapList(brandService.getAllBrands(),BrandDto.GetAllBrandDto.class,modelMapper));
    }

}
