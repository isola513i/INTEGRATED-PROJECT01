package com.example.backend.repositories;

import com.example.backend.entities.Brand;
import com.example.backend.entities.SaleItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem,Integer> {
     List<SaleItem> findAllByOrderByCreatedOnAscIdAsc();
     boolean existsByBrand_Id(Integer brandId);
     int countByBrandId(Integer brandId);
     List<SaleItem> findByBrand_NameIn(List<String> brandNames, Sort sort);
     Page<SaleItem> findByBrandNameIn(List<String> brands, Pageable pageable);
}
