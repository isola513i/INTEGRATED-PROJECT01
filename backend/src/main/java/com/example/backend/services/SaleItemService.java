package com.example.backend.services;

import ch.qos.logback.core.model.Model;
import com.example.backend.dtos.SaleItemDto;
import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.BrandRepository;
import com.example.backend.repositories.SaleItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class SaleItemService {
    @Autowired
    private SaleItemRepository saleItemRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private ModelMapper modelMapper;
    public List<SaleItem> allSaleItems() {
        return saleItemRepository.findAllByOrderByCreatedOnAscIdAsc();
    }

    public SaleItem findSaleItemById(Integer id) {
        return saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
    }

    public void deleteSaleItem(Integer id) {
        if (saleItemRepository.existsById(id)) {
            saleItemRepository.deleteById(id);
        } else throw new ItemNotFoundException("SaleItem not found for this id :: " + id);
    }

    @Transactional
    public SaleItem updateSaleItem(Integer id, SaleItemDto.GetCreateSaleItemDto saleItemDto) {
        SaleItem saleItem = saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: " + id));
        Brand brand = brandRepository.findById(saleItemDto.getBrand().getId()).orElseThrow(
                () -> new ItemNotFoundException("Brand not found for this id :: " + saleItemDto.getBrand().getId() ));
        saleItem.setModel(saleItemDto.getModel());
        saleItem.setBrand(brand);
        saleItem.setDescription(saleItemDto.getDescription());
        saleItem.setPrice(saleItemDto.getPrice());
        saleItem.setRamGb(saleItemDto.getRamGb());
        saleItem.setScreenSizeInch(saleItemDto.getScreenSizeInch());
        saleItem.setQuantity(saleItemDto.getQuantity());
        saleItem.setStorageGb(saleItemDto.getStorageGb());
        saleItem.setColor(saleItemDto.getColor());

        SaleItem updateItem = saleItemRepository.saveAndFlush(saleItem);
        entityManager.refresh(updateItem);
        return saleItemRepository.findById(updateItem.getId()).orElseThrow();
    }

    @Transactional
    public SaleItem addSaleItem( SaleItem saleItem) {
        if (saleItem.getBrand() == null || saleItem.getBrand().getId() == null) {
            throw new IllegalArgumentException("Brand id must not be null");
        }
        Brand brand = brandRepository.
                findById(saleItem.getBrand().getId()).orElseThrow(
                        ()-> new ItemNotFoundException("Brand not found for this id :: "
                                + saleItem.getBrand().getId()));
        saleItem.setBrand(brand);
        SaleItem savedItem = saleItemRepository.saveAndFlush(saleItem);
        entityManager.refresh(savedItem);
        return saleItemRepository.findById(savedItem.getId()).orElseThrow();
        }

}


