package com.example.backend.repositories;

import com.example.backend.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    boolean existsByNameAndIdNot(String name, Integer id);
    boolean existsByName(String name);
    Optional<Brand> findByIdAndIsDeletedFalse(Integer id);
    List<Brand> findAllByIsDeletedFalse();
    boolean existsByNameAndIdNotAndIsDeletedFalse(String trim, int id);
    List<Brand> findAllByIsDeletedFalseOrderByCreatedOnAsc();
}