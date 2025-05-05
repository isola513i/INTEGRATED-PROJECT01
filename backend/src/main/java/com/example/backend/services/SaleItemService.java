package com.example.backend.services;

import com.example.backend.entities.SaleItem;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.SaleItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleItemService {
    @Autowired
    private SaleItemRepository saleItemRepository;

    public List<SaleItem> allSaleItems(){
        return saleItemRepository.findAllByOrderByCreatedOnAscIdAsc();
    }
    public SaleItem findSaleItemById(Integer id){
        return saleItemRepository.findById(id).orElseThrow(() -> new ItemNotFoundException("SaleItem not found for this id :: "+id));
    }
}
