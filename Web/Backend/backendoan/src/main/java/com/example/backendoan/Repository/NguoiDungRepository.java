package com.example.backendoan.Repository;

import com.example.backendoan.Entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {
    NguoiDung findById(int id);
    Optional<NguoiDung> findByEmail(String taikhoan);
}
