package com.example.backendoan.Repository;

import com.example.backendoan.Entity.HoaDonGiaHan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoaDonGiaHanRepository extends JpaRepository<HoaDonGiaHan, Integer> {
    // Custom query methods can be defined here if needed
    // For example, to find all images by MauXe ID
    List<HoaDonGiaHan> findByDonDatXeId(Integer dondatxeId);
}
