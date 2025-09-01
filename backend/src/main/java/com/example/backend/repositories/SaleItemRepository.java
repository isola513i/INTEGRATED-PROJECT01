package com.example.backend.repositories;

import com.example.backend.entities.SaleItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer>, JpaSpecificationExecutor<SaleItem> {
    @Query("select s from SaleItem s join fetch s.brand order by s.createdOn asc, s.id asc")
    List<SaleItem> findAllWithBrandOrderByCreatedOnAscIdAsc();
    boolean existsByBrand_Id(Integer brandId);
    int countByBrandId(Integer brandId);
    @Query(
            value = """
            select s
            from SaleItem s
                 join fetch s.brand b
            where (:brands is null or b.name in :brands)
              and (:lowerPrice is null or s.price >= :lowerPrice)
              and (:upperPrice is null or s.price <= :upperPrice)
              and (:storageSizes is null or s.storageGb in :storageSizes)
            """,
            countQuery = """
            select count(s)
            from SaleItem s
                 join s.brand b
            where (:brands is null or b.name in :brands)
              and (:lowerPrice is null or s.price >= :lowerPrice)
              and (:upperPrice is null or s.price <= :upperPrice)
              and (:storageSizes is null or s.storageGb in :storageSizes)
            """
    )
    Page<SaleItem> findByFiltersWithBrand(
            @Param("brands") List<String> brands,
            @Param("lowerPrice") Double lowerPrice,
            @Param("upperPrice") Double upperPrice,
            @Param("storageSizes") List<Integer> storageSizes,
            Pageable pageable
    );
    @Query("select s from SaleItem s join fetch s.brand where s.id = :id")
    Optional<SaleItem> findByIdWithBrand(@Param("id") Integer id);

    @Query("""
SELECT m FROM SaleItem m
WHERE (:brands IS NULL OR m.brand.name IN :brands)
  AND (:lowerPrice IS NULL OR m.price >= :lowerPrice)
  AND (:upperPrice IS NULL OR m.price <= :upperPrice)
  AND (
        (:searchNullStorage = true AND m.storageGb IS NULL)
        OR (:storageSizes IS NOT NULL AND m.storageGb IN :storageSizes)
        OR (:storageSizes IS NULL AND :searchNullStorage = false)
      )
  AND (
        :search IS NULL
        OR LOWER(CONCAT(
            COALESCE(m.description, ''), ' ',
            COALESCE(m.color, ''), ' ',
            COALESCE(m.model, '')
        ))
        LIKE LOWER(CONCAT('%', REPLACE(:search, ' ', '%'), '%'))
      )
""")
    Page<SaleItem> findByAdvancedFilters(
            @Param("brands") List<String> brands,
            @Param("lowerPrice") Double minPrice,
            @Param("upperPrice") Double maxPrice,
            @Param("storageSizes") List<Integer> storages,
            @Param("searchNullStorage") boolean searchNullStorage,
            @Param("search") String search,
            Pageable pageable
    );
/*
:search IS NULL
        OR LOWER(CONCAT(m.description, ' ', m.model, ' ', m.color))
           LIKE LOWER(CONCAT('%', REPLACE(:search, ' ', '%'), '%'))
 */

    @Query("SELECT DISTINCT CASE WHEN s.storageGb IS NULL THEN -1 ELSE s.storageGb END " +
            "FROM SaleItem s ORDER BY CASE WHEN s.storageGb IS NULL THEN -1 ELSE s.storageGb END ASC")
    List<Integer> findDistinctStorageSizes();

}

