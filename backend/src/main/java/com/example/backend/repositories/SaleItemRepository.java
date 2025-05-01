package com.example.backend.repositories;

import com.example.backend.entities.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem,Integer> {

}
