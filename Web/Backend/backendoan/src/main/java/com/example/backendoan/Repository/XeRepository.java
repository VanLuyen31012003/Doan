package com.example.backendoan.Repository;

import com.example.backendoan.Entity.Xe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface XeRepository extends JpaRepository<Xe, Integer> {
    // Custom query methods can be defined here if needed
}
