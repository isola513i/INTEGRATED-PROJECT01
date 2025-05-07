package com.example.backend.controllers;


import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.SaleItem;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "${app.cors.allowedOrigins}")
@RestController
@RequestMapping("/itb-mshop/v1")
public class SaleItemController {
    @Autowired
    private SaleItemService saleItemService;
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

    @PutMapping("/sale-items/{id}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> updateSaleItem(@PathVariable Integer id ,@RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto){
        SaleItem updateSaleItem = saleItemService.updateSaleItem(id,modelMapper.map(saleItemDto,SaleItem.class));
        return ResponseEntity.ok(modelMapper.map(updateSaleItem
                ,SaleItemDto.GetSaleItemDto.class));
    }

}

