package com.example.backend.repositories;

import com.example.backend.entities.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem,Integer> {
    public List<SaleItem> findAllByOrderByCreatedOnAscIdAsc();
    public boolean existsByBrand_Id(Integer brandId);
}
