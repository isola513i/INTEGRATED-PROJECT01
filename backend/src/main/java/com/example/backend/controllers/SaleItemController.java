package com.example.backend.controllers;

import com.example.backend.dtos.*;
import com.example.backend.entities.SaleItem;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.SaleItemPictureRepository;
import com.example.backend.services.FileStorage;
import com.example.backend.services.SaleItemService;
import com.example.backend.utils.ListMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
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
    private final SaleItemPictureRepository picRepo;
    private final FileStorage storage;

    public SaleItemController(SaleItemService saleItemService, ModelMapper modelMapper, ListMapper listMapper, SaleItemPictureRepository picRepo, FileStorage storage) {
        this.saleItemService = saleItemService;
        this.modelMapper = modelMapper;
        this.listMapper = listMapper;
        this.picRepo = picRepo;
        this.storage = storage;
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

    // ========== V2 Endpoints ==========
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
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> getSaleItemV2ById(
            @PathVariable("id") Integer saleItemIdPath) {

        var saleItemResponse = saleItemService.sendV2Response(saleItemIdPath);
        return ResponseEntity.ok(saleItemResponse);
    }

    @GetMapping("/v2/sale-items/{saleItemId}/images/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(
            @PathVariable Integer saleItemId,
            @PathVariable String fileName,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) throws IOException {

        var pic = picRepo.findBySaleItemIdAndFileName(saleItemId, fileName)
                .orElseThrow(() -> new ItemNotFoundException("Image not found"));

        Resource res = storage.loadSaleItemFile(saleItemId, fileName);
        if (!res.exists() || !res.isReadable()) throw new ItemNotFoundException("Image file missing");
        Path filePath = res.getFile().toPath();

        if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
            throw new ItemNotFoundException("Image file missing");
        }

        var resource = new FileSystemResource(filePath);

        // Content-Type
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

        long size = Files.size(filePath);
        long lastMod = Files.getLastModifiedTime(filePath).toMillis();
        String eTag = "\"" + size + "-" + lastMod + "\"";

        if (eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(eTag).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .contentLength(size)
                .lastModified(lastMod)
                .eTag(eTag)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(30)).cachePublic())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
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

    @DeleteMapping("/v2/sale-items/{id}")
    public ResponseEntity<Void> deleteSaleItemV2(@PathVariable Integer id) {
        saleItemService.deleteSaleItem(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/v2/sale-items/{id}/images")
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> deleteImages(
            @PathVariable Integer id,
            @RequestBody SaleItemV2Dto.DeletePicturesRequest req) {
        return ResponseEntity.ok(saleItemService.deleteSaleItemWithImages(id, req));
    }

}

