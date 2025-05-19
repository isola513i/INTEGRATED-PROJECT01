package com.example.backend.controllers;


import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import com.example.backend.services.BrandService;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "${app.cors.allowedOrigins}")
//@CrossOrigin(origins= "*")


@RestController
@Getter
@Setter
@RequestMapping("/itb-mshop/v1")
public class SaleItemController {
    @Autowired
    private SaleItemService saleItemService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ListMapper listMapper;

    @GetMapping("/sale-items")
    public ResponseEntity<List<SaleItemDto.GetAllSaleItemsDto>> getAllItems(){
        return ResponseEntity.ok(listMapper.mapList(saleItemService.allSaleItems(),SaleItemDto.GetAllSaleItemsDto.class,modelMapper));
    }
    @GetMapping("/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> getSaleItemById(@PathVariable Integer saleItemId){
        return ResponseEntity.ok(modelMapper.map(saleItemService.findSaleItemById(saleItemId), SaleItemDto.GetSaleItemDto.class));
    }

    @PutMapping("/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> updateSaleItem(@PathVariable Integer saleItemId ,@RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto){
        return ResponseEntity.ok(modelMapper.map(saleItemService.updateSaleItem(saleItemId,saleItemDto),SaleItemDto.GetSaleItemDto.class));
    }

    @PostMapping("/sale-items")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> addSaleItem(
            @RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        SaleItem saleItem = modelMapper.map(saleItemDto,SaleItem.class);
        SaleItem savedItem = saleItemService.addSaleItem(saleItem);
        SaleItemDto.GetSaleItemDto dto = modelMapper.map(savedItem, SaleItemDto.GetSaleItemDto.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    @DeleteMapping("/sale-items/{saleItemId}")
    public ResponseEntity<Void> deleteSaleItem(@PathVariable Integer saleItemId){
        saleItemService.deleteSaleItem(saleItemId);
        return ResponseEntity.noContent().build();
    }

}

