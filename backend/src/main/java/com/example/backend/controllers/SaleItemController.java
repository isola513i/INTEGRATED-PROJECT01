package com.example.backend.controllers;


import com.example.backend.dtos.PageDto;
import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.SaleItem;
import com.example.backend.services.BrandService;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Getter
@Setter
@RequestMapping("/itb-mshop")
public class SaleItemController {
    @Autowired
    private SaleItemService saleItemService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ListMapper listMapper;

    @GetMapping("/v1/sale-items")
    public ResponseEntity<List<SaleItemDto.GetAllSaleItemsDto>> getAllItems(){
        return ResponseEntity.ok(listMapper.mapList(saleItemService.allSaleItems(),SaleItemDto.GetAllSaleItemsDto.class,modelMapper));
    }
    @GetMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> getSaleItemById(@PathVariable Integer saleItemId){
        return ResponseEntity.ok(modelMapper.map(saleItemService.findSaleItemById(saleItemId), SaleItemDto.GetSaleItemDto.class));
    }

    @PutMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> updateSaleItem(@PathVariable Integer saleItemId ,@RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto){
        return ResponseEntity.ok(modelMapper.map(saleItemService.updateSaleItem(saleItemId,saleItemDto),SaleItemDto.GetSaleItemDto.class));
    }

    @PostMapping("/v1/sale-items")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> addSaleItem(
            @RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        SaleItem saleItem = modelMapper.map(saleItemDto,SaleItem.class);
        SaleItem savedItem = saleItemService.addSaleItem(saleItem);
        SaleItemDto.GetSaleItemDto dto = modelMapper.map(savedItem, SaleItemDto.GetSaleItemDto.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    @DeleteMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<Void> deleteSaleItem(@PathVariable Integer saleItemId){
        saleItemService.deleteSaleItem(saleItemId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/v2/sale-items")
    public ResponseEntity<PageDto<SaleItemDto.GetSaleItemDto>> getSaleItems(
            @RequestParam(required = false) List<String> filterBrands,
            @RequestParam Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return ResponseEntity.ok(listMapper.toPageDTO(saleItemService
                        .findAllSaleItemsPage(filterBrands, page, size, sortField, sortDirection)
                , SaleItemDto.GetSaleItemDto.class, modelMapper));
    }

}

