package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Table(name = "don_dat_xe")
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonDatXe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "don_dat_xe_id")
    private Integer donDatXeId;

//    @ManyToOne
//    @JoinColumn(name = "khach_hang_id")
//    private KhachHang khachHang;
    @Column(name = "khach_hang_id")
    private Integer khachHangId;

    @Column(name = "nguoi_dung_id")
    private Integer nguoiDungId;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDateTime ngayKetThuc;

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal tongTien;

    @Column(name = "trang_thai", nullable = false)
    private Integer trangThai = 0;

    @Column(name = "dia_diem_nhan_xe", nullable = false)
    private String diaDiemNhanXe;

    @OneToMany(mappedBy = "donDatXe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDonDatXe> chiTiet = new ArrayList<>();

    @Column(name = "phuong_thuc_thanh_toan")
    private String phuongThucThanhToan;
    @Column(name = "trang_thai_thanh_toan")
    private Integer trangThaiThanhToan ;
    @Column(name = "tong_tien_landau")
    private  BigDecimal tongTienLandau;
}
