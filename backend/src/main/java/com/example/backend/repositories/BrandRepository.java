package com.example.backend.repositories;

import com.example.backend.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    public boolean existsByNameAndIdNot(String name, Integer id);
    public Optional<Brand> findByIdAndIsDeletedFalse(Integer id);
    public List<Brand> findAllByIsDeletedFalse();
}