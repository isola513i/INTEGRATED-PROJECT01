package com.example.backend.controllers;

import com.example.backend.dtos.BrandDto;
import com.example.backend.entities.Brand;
import com.example.backend.services.BrandService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
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
    @GetMapping("/brands/{id}")
    public ResponseEntity<BrandDto.GetBrandDto> getBrandById(@PathVariable int id) {
        return ResponseEntity.ok(modelMapper.map(brandService.getBrandById(id), BrandDto.GetBrandDto.class));
    }
    @PostMapping("/brands")
    public ResponseEntity<BrandDto.GetBrandDto> addBrand(
            @RequestBody BrandDto.GetBrandDto requestDto)
    {
        Brand createdBrand = brandService.addBrand(requestDto);
        BrandDto.GetBrandDto responseDto = modelMapper.map(createdBrand,
                BrandDto.GetBrandDto.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<BrandDto.GetBrandDto> updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandDto.UpdateBrandDto request) {
        Brand brand = brandService.updateBrand(id, request);
        return ResponseEntity.ok(modelMapper.map(brandService.getBrandById(brand.getId()), BrandDto.GetBrandDto.class));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable Integer id) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }

}
