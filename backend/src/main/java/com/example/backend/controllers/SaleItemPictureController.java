package com.example.backend.controllers;

import com.example.backend.dtos.PictureDto;
import com.example.backend.dtos.SavePicturesRequest;
import com.example.backend.services.SaleItemPictureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sale-items/{itemId}/pictures")
public class SaleItemPictureController {
    private final SaleItemPictureService service;
    public SaleItemPictureController(SaleItemPictureService service) { this.service = service; }

    @GetMapping
    public List<PictureDto> list(@PathVariable Integer itemId) {
        return service.list(itemId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<PictureDto> upload(@PathVariable Integer itemId,
                                   @RequestParam("files") List<MultipartFile> files) throws IOException {
        return service.upload(itemId, files);
    }

    @DeleteMapping("/{pictureId}")
    public void delete(@PathVariable Integer itemId, @PathVariable Integer pictureId) {
        service.delete(itemId, pictureId);
    }

    @PutMapping("/save")
    public List<PictureDto> saveState(@PathVariable Integer itemId,
                                      @RequestBody @jakarta.validation.Valid SavePicturesRequest req) {
        return service.saveState(itemId, req);
    }
}
