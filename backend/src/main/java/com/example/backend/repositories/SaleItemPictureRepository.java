package com.example.backend.repositories;

import com.example.backend.entities.SaleItemPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SaleItemPictureRepository extends JpaRepository<SaleItemPicture, Integer> {
    List<SaleItemPicture> findBySaleItemIdOrderByPositionAsc(Integer saleItemId);
    Optional<SaleItemPicture> findByFileName(String fileName);
    Optional<SaleItemPicture> findBySaleItemIdAndFileName(Integer saleItemId, String fileName);
}
