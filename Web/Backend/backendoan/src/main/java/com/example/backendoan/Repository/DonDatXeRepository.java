package com.example.backendoan.Repository;

import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonDatXeRepository extends JpaRepository<DonDatXe, Integer> {
    List<DonDatXe> findByKhachHangId(Integer khachHangId);
    List<DonDatXe> findByTrangThai(Integer trangThai);

}
