package com.example.backendoan.Repository;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.Xe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChiTietDonDatXeRepository extends JpaRepository<ChiTietDonDatXe, Integer> {
    List<ChiTietDonDatXe> findByDonDatXe_DonDatXeId(Integer donDatXeId);
    @Query("SELECT c.donDatXe FROM ChiTietDonDatXe c WHERE c.xeId = :xeId")
    List<DonDatXe> findDonDatXeByXeId(@Param("xeId") Integer xeId);
    @Query("SELECT DISTINCT ctd.xeId FROM ChiTietDonDatXe ctd " +
            "JOIN DonDatXe dd ON ctd.donDatXe.donDatXeId = dd.donDatXeId " +
            "JOIN Xe x ON ctd.xeId = x.xeId " +
            "WHERE x.mauXe.mauXeId = :mauXeId " +
            "AND (dd.ngayBatDau <= :endDate AND dd.ngayKetThuc >= :startDate)")
    List<Integer> findBookedXeIds(@Param("mauXeId") Integer mauXeId,
                                  @Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate);
    @Query("SELECT DISTINCT x FROM Xe x " +
            "WHERE x.xeId IN (SELECT ctd.xeId FROM ChiTietDonDatXe ctd " +
            "JOIN ctd.donDatXe dd " +
            "WHERE (dd.ngayBatDau <= :endDate AND dd.ngayKetThuc >= :startDate))")
    List<Xe> findBookedVehicles(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DISTINCT x FROM Xe x " +
            "WHERE x.xeId IN (SELECT ctd.xeId FROM ChiTietDonDatXe ctd " +
            "JOIN ctd.donDatXe dd " +
            "WHERE (dd.ngayBatDau <= CURRENT_TIMESTAMP AND dd.ngayKetThuc >= CURRENT_TIMESTAMP))")
    List<Xe> findCurrentlyBookedVehicles();
}
