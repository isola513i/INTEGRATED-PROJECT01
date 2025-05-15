package com.example.backend.repositories;

import com.example.backend.entities.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem,Integer> {
     List<SaleItem> findAllByOrderByCreatedOnAscIdAsc();
     boolean existsByBrand_Id(Integer brandId);
}
