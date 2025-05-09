package com.example.backendoan.Repository;

import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface DonDatXeRepository extends JpaRepository<DonDatXe, Integer> {
    List<DonDatXe> findByKhachHangId(Integer khachHangId);
    List<DonDatXe> findByTrangThai(Integer trangThai);
    @Query("SELECT d FROM DonDatXe d JOIN ChiTietDonDatXe c ON d.donDatXeId = c.donDatXe.donDatXeId " +
            "WHERE c.xeId = :xeId AND d.trangThai = 1 " +
            "AND ((d.ngayBatDau <= :endDate AND d.ngayKetThuc >= :startDate))")
    List<DonDatXe> findConflictingBookings(Integer xeId, LocalDateTime  startDate, LocalDateTime endDate);
}


