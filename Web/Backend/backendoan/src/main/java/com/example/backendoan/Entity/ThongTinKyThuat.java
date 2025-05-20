package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "thong_tin_ky_thuat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThongTinKyThuat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ky_thuat_id")
    private Integer kyThuatId;

    @Column(name = "mau_xe_id")
    private Integer mauXeId;

    @Column(name = "dong_co")
    private String dongCo;

    @Column(name = "dung_tich")
    private Integer dungTich;

    @Column(name = "nhien_lieu")
    private String nhienLieu;

    @Column(name = "kich_thuoc")
    private String kichThuoc;

    @Column(name = "trong_luong")
    private Integer trongLuong;

    @Column(name = "loai_hop_so")
    private String loaiHopSo;

    @Column(name = "he_thong_phanh")
    private String heThongPhanh;

    @Column(name = "phuoc_truoc")
    private String phuocTruoc;

    @Column(name = "phuoc_sau")
    private String phuocSau;

    @Column(name = "dung_tich_binh_xang")
    private Double dungTichBinhXang;

    @Column(name = "tieu_thu_nhien_lieu")
    private Double tieuThuNhienLieu;

    @Column(name = "loai_lop")
    private String loaiLop;

    @Column(name = "kich_thuoc_lop_truoc")
    private String kichThuocLopTruoc;

    @Column(name = "kich_thuoc_lop_sau")
    private String kichThuocLopSau;

    @Column(name = "loai_den")
    private String loaiDen;
}
