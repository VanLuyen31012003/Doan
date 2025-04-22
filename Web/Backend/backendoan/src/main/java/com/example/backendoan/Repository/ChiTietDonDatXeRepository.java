package com.example.backendoan.Repository;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChiTietDonDatXeRepository extends JpaRepository<ChiTietDonDatXe, Integer> {
    List<ChiTietDonDatXe> findByDonDatXe_DonDatXeId(Integer donDatXeId);
}
