package com.example.backend.controllers;

import com.example.backend.dtos.*;
import com.example.backend.entities.SaleItem;
import com.example.backend.entities.User;
import com.example.backend.exceptions.SellerNotMatchInTokenException;
import com.example.backend.repositories.SaleItemPictureRepository;
import com.example.backend.services.FileStorage;
import com.example.backend.services.SaleItemService;
import com.example.backend.services.UserService;
import com.example.backend.utils.JwtUtils;
import com.example.backend.utils.ListMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.eclipse.angus.mail.iap.Response;
import org.hibernate.dialect.SybaseDialect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLOutput;
import java.util.List;

@RestController
@Getter
@Setter
@CrossOrigin("*")
@RequestMapping("/itb-mshop")
public class SaleItemController {
    @Autowired
    private SaleItemService saleItemService;
    @Autowired
    private ListMapper listMapper;
    @Autowired
    private SaleItemPictureRepository picRepo;
    @Autowired
    private FileStorage storage;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtils jwtUtils;

    // ========== V1 Endpoints ==========
    @GetMapping("/v1/sale-items")
    public ResponseEntity<List<SaleItemDto.GetAllSaleItemsDto>> getAllItems() {
        return ResponseEntity.ok(listMapper.mapList(saleItemService.allSaleItems(), SaleItemDto.GetAllSaleItemsDto.class, modelMapper));
    }

    @GetMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> getSaleItemById(@PathVariable Integer saleItemId) {
        return ResponseEntity.ok(saleItemService.getSaleItemDetail(saleItemId));
    }

    @GetMapping("/v1/storage")
    public List<Integer> getStorageSizes() {
        return saleItemService.getAllStorageSizes();
    }


    @PutMapping("/v1/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemDto.GetSaleItemDto> updateSaleItem(@PathVariable Integer saleItemId, @RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        return ResponseEntity.ok(modelMapper.map(saleItemService.updateSaleItem(saleItemId, saleItemDto), SaleItemDto.GetSaleItemDto.class));
    }

//    @PostMapping("/v1/sale-items")
//    public ResponseEntity<SaleItemDto.GetSaleItemDto> addSaleItem(
//            @RequestBody SaleItemDto.GetCreateSaleItemDto saleItemDto) {
//        SaleItem saleItem = modelMapper.map(saleItemDto, SaleItem.class);
//        SaleItem savedItem = saleItemService.addSaleItem(saleItem);
//        SaleItemDto.GetSaleItemDto dto = modelMapper.map(savedItem, SaleItemDto.GetSaleItemDto.class);
//        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
//    }

//    @DeleteMapping("/v1/sale-items/{saleItemId}")
//    public ResponseEntity<Void> deleteSaleItem(@PathVariable Integer saleItemId) {
//        saleItemService.deleteSaleItem(saleItemId);
//        return ResponseEntity.noContent().build();
//    }

    // ========== V2 Endpoints ==========
    @PostMapping(value = "/v2/sellers/{id}/sale-items", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> createSaleItemV2(
            @ModelAttribute SaleItemDto.GetCreateSaleItemDto newSaleItem,
            @RequestParam(required = false) List<SaleItemV2Dto.SaleItemImageRequest> images,
            @PathVariable Integer id,
            HttpServletRequest request) throws IOException {
        SaleItemV2Dto.SaleItemWithImageInfo req = new SaleItemV2Dto.SaleItemWithImageInfo();
        req.setSaleItem(newSaleItem);
        req.setImageInfos(images);
        var res = saleItemService.createSaleItemWithImages(newSaleItem,images,request,id);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    // GET all saleItems
    @GetMapping("/v2/sale-items")
    public ResponseEntity<PageDto<SaleItemV2Dto.SaleItemV2Response>> getAllSaleItemsV2(
            @RequestParam(required = false) List<String> filterBrands,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) Double lowerPrice,
            @RequestParam(required = false) Double upperPrice,
            @RequestParam(required = false) List<Integer> storageSizes,
            @RequestParam(required = false) String searchKeyWord
    ) {
        if (lowerPrice != null && upperPrice != null && lowerPrice > upperPrice) {
            double t = lowerPrice;
            lowerPrice = upperPrice;
            upperPrice = t;
        }
        var pageData = saleItemService
                .findAllSaleItemsPage(filterBrands, page, size, sortField, sortDirection, lowerPrice, upperPrice, storageSizes, searchKeyWord)
                .map(si -> saleItemService.getSaleItemDetailV2(si.getId()));

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

    // GET saleItem by Id
    @GetMapping("/v2/sale-items/{saleItemId}")
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> getSaleItemV2ById(
            @PathVariable("saleItemId") Integer saleItemIdPath) {

        var saleItemResponse = saleItemService.getSaleItemDetailV2(saleItemIdPath);
        return ResponseEntity.ok(saleItemResponse);
    }

    // GET all images for a saleItem
    @GetMapping("/v2/sale-items/{id}/images")
    public ResponseEntity<List<SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto>> listSaleItemImages(
            @PathVariable Integer id
    ) {
        saleItemService.ensureItemExists(id);

        var pics = picRepo.findBySaleItemIdOrderByPositionAsc(id);

        var list = pics.stream().map(p -> {
            var dto = new SaleItemV2Dto.SaleItemV2Response.SaleItemImageDto();
            dto.setFileName(p.getFileName());
            dto.setImageViewOrder(p.getPosition() + 1);
            return dto;
        }).toList();

        return ResponseEntity.ok(list);
    }

    // GET single image
    @GetMapping("/v2/sale-items/{saleItemId}/images/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(
            @PathVariable Integer saleItemId,
            @PathVariable String fileName,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch
    ) throws IOException {
        var meta = saleItemService.loadImage(saleItemId, fileName);
        if (ifNoneMatch != null && ifNoneMatch.equals(meta.etag())) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(meta.etag()).build();
        }
        return ResponseEntity.ok()
                .contentType(meta.mediaType())
                .eTag(meta.etag())
                .body(meta.body());
    }

    // UPDATE saleItem - edit
    @PutMapping(value = "/v2/sellers/{id}/sale-items/{saleItemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SaleItemV2Dto.SaleItemV2Response> updateSaleItemWithImages(
            @PathVariable("id") Integer sellerId,
            @PathVariable("saleItemId") Integer itemId,
            @ModelAttribute SaleItemV2Dto.SaleItemWithImageInfo request,
            HttpServletRequest requestHttp
    ) throws IOException {
        Integer userIdInToken =  jwtUtils.extractUserId(requestHttp);
        User user = userService.getUserById(sellerId);
        if (userIdInToken == null || !userIdInToken.equals(sellerId) || !user.getIsActive()) {
            throw new SellerNotMatchInTokenException("Seller does not match the user in token or user is not active.");
        }
        var result = saleItemService.updateSaleItemWithImages(itemId, request , sellerId);
        return ResponseEntity.ok(result);
    }

    // DELETE saleItem edit
    @DeleteMapping("/v2/sellers/{id}/sale-items/{saleItemId}")
    public ResponseEntity<Void> deleteSaleItemV2(
            @PathVariable("saleItemId") Integer saleItemId,
            @PathVariable("id") Integer sellerId ,
            HttpServletRequest request ) {
        Integer userIdInToken =  jwtUtils.extractUserId(request);
        User user = userService.getUserById(sellerId);
        if (userIdInToken == null || !userIdInToken.equals(sellerId) || !user.getIsActive()) {
            throw new SellerNotMatchInTokenException("Seller does not match the user in token or user is not active.");
        }
        saleItemService.deleteSaleItemAndImages(saleItemId, sellerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/v2/sellers/{id}/sale-items")
    public ResponseEntity<PageDto<SaleItemV2Dto.SaleItemV2SellerResponse>> getSaleItemsBySeller(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @PathVariable Integer id,
            HttpServletRequest request
    ) {
        Integer userIdInToken =  jwtUtils.extractUserId(request);
        User user = userService.getUserById(id);
        if (userIdInToken == null || !userIdInToken.equals(id) || !user.getIsActive()) {
            throw new SellerNotMatchInTokenException("Seller does not match the user in token or user is not active.");
        }
        return ResponseEntity.ok(saleItemService.findAllSaleItemsPageBySeller(page, size, sortField, sortDirection, id));
    }

}

