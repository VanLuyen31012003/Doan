package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "khach_hang_id")
    private Integer khachHangId;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "so_dien_thoai", nullable = false)
    private String soDienThoai;

    @Column(name = "mat_khau", nullable = false)
    private String matKhau;
    @Column(name = "dia_chi")
    private String diaChi;
    @Column(name = "so_cccd", unique = true)
    private String soCccd;
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
//    @OneToMany(mappedBy = "khachHang", cascade = CascadeType.ALL)
//    private List<DonDatXe> donDatXes;

}
