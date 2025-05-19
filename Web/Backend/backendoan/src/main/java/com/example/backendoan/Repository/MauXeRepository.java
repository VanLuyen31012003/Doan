package com.example.backendoan.Repository;

import com.example.backendoan.Entity.MauXe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MauXeRepository extends JpaRepository<MauXe, Integer>, JpaSpecificationExecutor<MauXe> {
    //get all MauXe by loaiXeId
//     Page<MauXe> findByLoaiXe_LoaiXeId(Integer loaiXeId, Pageable pageable);
    Page<MauXe> findByLoaiXeId(Integer loaiXeId, Pageable pageable);

    // Custom query methods can be defined here if needed
    @Query("SELECT m FROM MauXe m " +
            "WHERE (:tenMau IS NULL OR LOWER(m.tenMau) LIKE LOWER(CONCAT('%', :tenMau, '%'))) " +
            "AND (:loaiXeId IS NULL OR m.loaiXeId = :loaiXeId) " +
            "AND (:hangXeId IS NULL OR m.hangXeId = :hangXeId)")
    Page<MauXe> searchMauXe(
            @Param("tenMau") String tenMau,
            @Param("loaiXeId") Integer loaiXeId,
            @Param("hangXeId") Integer hangXeId,
            Pageable pageable);
    List<MauXe> findTop6ByOrderBySoluotdatDesc(Pageable pageable);
    List<MauXe> findTop6ByLoaiXeIdOrderBySoluotdatDesc(Integer loaiXeId, Pageable pageable);
}
