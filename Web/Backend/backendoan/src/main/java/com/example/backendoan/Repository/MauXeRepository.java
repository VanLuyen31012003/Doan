package com.example.backendoan.Repository;

import com.example.backendoan.Entity.MauXe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MauXeRepository extends JpaRepository<MauXe, Integer> {
    // Custom query methods can be defined here if needed
}
