package com.example.backend.repositories;

import com.example.backend.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    public boolean existsByNameAndIdNot(String name, Integer id);
}