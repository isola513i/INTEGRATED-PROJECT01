package com.example.backend.controllers;

import com.example.backend.dtos.BrandDto;
import com.example.backend.exceptions.DuplicateNameException;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.services.BrandService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "${app.cors.allowedOrigins}")
@CrossOrigin(origins= "*")
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

    @PutMapping("/brands/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable Integer id,
                                         @RequestBody BrandDto.UpdateBrandDto request) {
        try {
            var updatedBrand = brandService.updateBrand(id, request);
            var response = modelMapper.map(updatedBrand, BrandDto.GetBrandDto.class);
            return ResponseEntity.ok(response);
        } catch (DuplicateNameException e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("message", "Duplicate name")
            );
        } catch (ItemNotFoundException e) {
            return ResponseEntity.status(404).body(
                    java.util.Map.of("message", "Brand not found")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    java.util.Map.of("message", "Create failed")
            );
        }
    }

}
