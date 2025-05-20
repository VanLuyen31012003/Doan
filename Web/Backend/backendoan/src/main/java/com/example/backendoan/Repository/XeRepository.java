package com.example.backendoan.Repository;

import com.example.backendoan.Entity.Xe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface XeRepository extends JpaRepository<Xe, Integer> {
    List<Xe> findByMauXe_MauXeIdAndTrangThai(Integer mauXeId, Integer trangThai);
    Integer countByMauXe_MauXeIdAndTrangThai(Integer mauXeId, Integer trangThai);
    List<Xe> findByMauXe_MauXeId(Integer hangXeId);

}
