package com.example.backendoan.Repository;

import com.example.backendoan.Entity.LoaiXe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoaiXeRepository extends JpaRepository<LoaiXe, Integer> {
    // Optional<LoaiXe> findById(int id);
    // Optional<LoaiXe> findByTen(String ten);
//    LoaiXe findByTen(String ten);
}
