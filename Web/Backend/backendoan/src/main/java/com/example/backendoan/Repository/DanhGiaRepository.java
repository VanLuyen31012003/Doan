package com.example.backendoan.Repository;

import com.example.backendoan.Entity.DanhGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DanhGiaRepository extends JpaRepository<DanhGia, Integer> {
    // DanhGia findById(int id);
    // DanhGia findByEmail(String email);
    // boolean existsByEmail(String email);
    // Tìm đánh giá theo mauXeId và soSao
    Page<DanhGia> findByMauXeIdAndSoSao(Integer mauXeId, Integer soSao, Pageable pageable);

    // Tìm đánh giá theo mauXeId (nếu không lọc theo soSao)
    Page<DanhGia> findByMauXeId(Integer mauXeId, Pageable pageable);
}
