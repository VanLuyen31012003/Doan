package com.example.backendoan.Repository;

import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DonDatXeRepository extends JpaRepository<DonDatXe, Integer> {
    List<DonDatXe> findByKhachHangId(Integer khachHangId);
    List<DonDatXe> findByNguoiDungId(Integer nguoiDungId);
    @Query("SELECT d FROM DonDatXe d JOIN ChiTietDonDatXe c ON d.donDatXeId = c.donDatXe.donDatXeId " +
            "WHERE c.xeId = :xeId AND d.trangThai IN (1, 0,4) " +
            "AND ((d.ngayBatDau <= :endDate AND d.ngayKetThuc >= :startDate))")
    List<DonDatXe> findConflictingBookings(Integer xeId, LocalDateTime  startDate, LocalDateTime endDate);
    // Thêm vào DonDatXeRepository.java
    List<DonDatXe> findByTrangThai(Integer trangThai);

    // Hoặc query phức tạp hơn nếu cần
    @Query("SELECT d FROM DonDatXe d WHERE d.trangThai = 4 AND d.ngayKetThuc < CURRENT_TIMESTAMP")
    List<DonDatXe> findOverdueRentals();

    @Query("SELECT d FROM DonDatXe d WHERE d.trangThai = 4 AND d.ngayKetThuc BETWEEN CURRENT_TIMESTAMP AND :tomorrow")
    List<DonDatXe> findRentalsEndingSoon(@Param("tomorrow") LocalDateTime tomorrow);
}


