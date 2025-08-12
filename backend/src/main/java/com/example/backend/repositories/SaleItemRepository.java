package com.example.backend.repositories;

import com.example.backend.entities.SaleItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem,Integer> {
     List<SaleItem> findAllByOrderByCreatedOnAscIdAsc();
     boolean existsByBrand_Id(Integer brandId);
     int countByBrandId(Integer brandId);
     @Query("""
        SELECT s
        FROM SaleItem s
        WHERE (:brands IS NULL OR s.brand.name IN :brands)
          AND (:lowerPrice IS NULL OR s.price >= :lowerPrice)
          AND (:upperPrice IS NULL OR s.price <= :upperPrice)
          AND (:storageSizes IS NULL OR s.storageGb IN :storageSizes)
    """)
     Page<SaleItem> findByFilters(
             @Param("brands") List<String> brands,
             @Param("lowerPrice") Double lowerPrice,
             @Param("upperPrice") Double upperPrice,
             @Param("storageSizes") List<Integer> storageSizes,
             Pageable pageable);

}
