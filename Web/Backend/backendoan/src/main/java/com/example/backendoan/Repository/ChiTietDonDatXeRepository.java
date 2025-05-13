package com.example.backendoan.Repository;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChiTietDonDatXeRepository extends JpaRepository<ChiTietDonDatXe, Integer> {
    List<ChiTietDonDatXe> findByDonDatXe_DonDatXeId(Integer donDatXeId);
    @Query("SELECT c.donDatXe FROM ChiTietDonDatXe c WHERE c.xeId = :xeId")
    List<DonDatXe> findDonDatXeByXeId(@Param("xeId") Integer xeId);
}
