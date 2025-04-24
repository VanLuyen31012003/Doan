package com.example.backendoan.Repository;

import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
//    KhachHang findById(int id);
//    KhachHang findByEmail(String email);
    Optional<KhachHang> findByEmail(String email);
    boolean existsByEmail(String email);


}
