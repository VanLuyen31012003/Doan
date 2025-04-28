package com.example.backendoan.Repository;

import com.example.backendoan.Entity.ThongTinKyThuat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ThongTinKyThuatRepository extends JpaRepository< ThongTinKyThuat,Integer> {
    Optional<ThongTinKyThuat> findFirstByMauXeIdOrderByKyThuatIdAsc(Integer mauXeId);
}
