package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don_gia_han")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoaDonGiaHan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hoa_don_gia_han_id")
    private Integer hoaDonGiaHanId;

    @Column(name = "don_dat_xe_id", nullable = false)
    private Integer donDatXeId;

    @Column(name = "ngay_bat_dau_gia_han", nullable = false)
    private LocalDateTime ngayBatDauGiaHan;

    @Column(name = "ngay_ket_thuc_gia_han", nullable = false)
    private LocalDateTime ngayKetThucGiaHan;

    @Column(name = "tong_tien_gia_han", nullable = false)
    private Double tongTienGiaHan;

    @Column(name = "trang_thai_thanh_toan")
    private Integer trangThaiThanhToan; // 0: chưa thanh toán, 1: đã thanh toán

    @Column(name = "phuong_thuc_thanh_toan")
    private String phuongThucThanhToan;

}
