package com.example.backend.controllers;

import com.example.backend.dtos.*;
import com.example.backend.entities.SaleItem;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@Getter
@Setter
@CrossOrigin("*")
@RequestMapping("/itb-mshop")
public class SaleItemController {

    private final SaleItemService saleItemService;
    private final ModelMapper modelMapper;
    private final ListMapper listMapper;

    public SaleItemController(SaleItemService saleItemService, ModelMapper modelMapper, ListMapper listMapper) {
        this.saleItemService = saleItemService;
        this.modelMapper = modelMapper;
        this.listMapper = listMapper;
    }

    // ========== V1 Endpoints ==========
    @GetMapping("/v1/sale-items")
    public ResponseEntity<List<SaleItemDto.GetAllSaleItemsDto>> getAllItems(){
        return ResponseEntity.ok(listMapper.mapList(saleItemService.allSaleItems(),SaleItemDto.GetAllSaleItemsDto.class,modelMapper));
    }

    @GetMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> getSaleItemById(@PathVariable Integer saleItemId){
        return ResponseEntity.ok(saleItemService.getSaleItemDto(saleItemId));
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

    //@GetMapping("/v2/sale-items")
    //public ResponseEntity<PageDto<SaleItemDto.GetSaleItemDto>> getSaleItems(
    //        @RequestParam(required = false) List<String> filterBrands,
    //        @RequestParam(defaultValue = "0") Integer page,
    //        @RequestParam(defaultValue = "10") Integer size,
    //        @RequestParam(required = false) String sortField,
    //        @RequestParam(defaultValue = "asc") String sortDirection,
    //        @RequestParam(required = false) Double lowerPrice,
    //       @RequestParam(required = false) Double upperPrice,
    //       @RequestParam(required = false) List<Integer> storageSizes
    //       ) {
    //   if(lowerPrice != null && upperPrice != null && lowerPrice > upperPrice){
    //        Double tempPrice = lowerPrice;
    //        lowerPrice = upperPrice;
    //         upperPrice = tempPrice;
    //    }
    //    return ResponseEntity.ok(listMapper.toPageDTO(saleItemService
    //                    .findAllSaleItemsPage(filterBrands, page, size, sortField, sortDirection, lowerPrice, upperPrice, storageSizes)
    //            , SaleItemDto.GetSaleItemDto.class, modelMapper));
    // }

    // ========== V2 ==========
    @GetMapping("/v2/sale-items")
    public ResponseEntity<PageDto<SaleItemV2Dto.SaleItemV2Response>> getAllSaleItemsV2(
            @RequestParam(required = false) List<String> filterBrands,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) Double lowerPrice,
            @RequestParam(required = false) Double upperPrice,
            @RequestParam(required = false) List<Integer> storageSizes
    ) {
        if (lowerPrice != null && upperPrice != null && lowerPrice > upperPrice) {
            double t = lowerPrice; lowerPrice = upperPrice; upperPrice = t;
        }
        var pageData = saleItemService
                .findAllSaleItemsPage(filterBrands, page, size, sortField, sortDirection, lowerPrice, upperPrice, storageSizes)
                .map(si -> saleItemService.sendV2Response(si.getId()));

        var dto = new PageDto<SaleItemV2Dto.SaleItemV2Response>();
        dto.setContent(pageData.getContent());
        dto.setNumber(pageData.getNumber());
        dto.setSize(pageData.getSize());
        dto.setTotalElements((int) pageData.getTotalElements());
        dto.setTotalPages(pageData.getTotalPages());
        dto.setFirst(pageData.isFirst());
        dto.setLast(pageData.isLast());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/v2/sale-items/{id}")
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> getSaleItemByIdV2(@PathVariable Integer id) {
        return ResponseEntity.ok(saleItemService.sendV2Response(id));
    }

    @GetMapping("/v2/sale-items/{id}/images")
    public ResponseEntity<List<SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto>> listImagesView(@PathVariable Integer id) {
        var pics = saleItemService.findByItemOrdered(id);
        var out = pics.stream().map(p -> {
            var dto = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
            dto.setPictureId(p.getId());
            dto.setFileName(p.getFileName());
            dto.setImageViewOrder(p.getPosition() + 1);
            return dto;
        }).toList();
        return ResponseEntity.ok(out);
    }

    @PostMapping(value = "/v2/sale-items", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> createSaleItemV2(
            @ModelAttribute SaleItemV2Dto.SaleItemWithImageInfo req) throws IOException {
        var res = saleItemService.createSaleItemWithImages(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping(value = "/v2/sale-items/{id}" ,consumes =  MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> updateSaleItemWithImages(
            @PathVariable("id") Integer itemId,
            @ModelAttribute SaleItemV2Dto.SaleItemWithImageInfo request
    ) throws IOException {
        var result = saleItemService.updateSaleItemWithImages(itemId, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/v2/sale-items/{id}/images")
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> deleteImages(
            @PathVariable Integer id,
            @RequestBody SaleItemV2Dto.DeletePicturesRequest req) {
        return ResponseEntity.ok(saleItemService.deleteSaleItemWithImages(id, req));
    }

    @DeleteMapping("/v2/sale-items/{id}")
    public ResponseEntity<Void> deleteSaleItemV2(@PathVariable Integer id) {
        saleItemService.deleteSaleItem(id);
        return ResponseEntity.noContent().build();
    }

}

