package com.example.backend.controllers;

import com.example.backend.dtos.PageDto;
import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import com.example.backend.services.BrandService;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("itb-mshop/v2")
@RestController
public class SaleItemControllerV2 {
    @Autowired
    private SaleItemService saleItemService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ListMapper listMapper;

    //    @GetMapping("/sale-items")
//    public ResponseEntity<List<SaleItemDto.GetAllSaleItemsDto>> getFilteredAndSortedItems(
//            @RequestParam(required = false) List<String> filterBrands,
//            @RequestParam(required = false) String sortField,
//            @RequestParam(defaultValue = "asc") String sortDirection
//    ) {
//        List<SaleItem> saleItems = saleItemService.getSaleItemsFilteredAndSorted(
//                filterBrands, sortField, sortDirection
//        );
//        return ResponseEntity.ok(
//                listMapper.mapList(saleItems, SaleItemDto.GetAllSaleItemsDto.class, modelMapper)
//        );
//    }
    @GetMapping("/sale-items")
    public ResponseEntity<PageDto<SaleItemDto.GetSaleItemDto>> getSaleItems(
            @RequestParam(required = false) List<String> filterBrands,
            @RequestParam Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        return ResponseEntity.ok(listMapper.toPageDTO(saleItemService.findAllSaleItemsPage(filterBrands, page, size, sortField, sortDirection), SaleItemDto.GetSaleItemDto.class, modelMapper));
    }
}
