package com.example.backendoan.Repository;

import com.example.backendoan.Entity.AnhXe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnhXeRepository extends JpaRepository<AnhXe, Integer> {
    // Custom query methods can be defined here if needed
    // For example, to find all images by MauXe ID
    List<AnhXe> findByMauXeId(Integer mauXeId);
}
