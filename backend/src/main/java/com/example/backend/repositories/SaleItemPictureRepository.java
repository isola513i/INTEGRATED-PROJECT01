package com.example.backend.repositories;

import com.example.backend.entities.SaleItemPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaleItemPictureRepository extends JpaRepository<SaleItemPicture, Integer> {
    List<SaleItemPicture> findBySaleItemIdOrderByPositionAsc(Integer saleItemId);
    long countBySaleItemId(Integer saleItemId);
}
