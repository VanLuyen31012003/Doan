package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name = "mau_xe")
public class MauXe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mau_xe_id")
    private Integer mauXeId;

    @Column(name = "ten_mau", nullable = false)
    private String tenMau;

    //    @ManyToOne
//    @JoinColumn(name = "hang_xe_id")
//    private HangXe hangXe;
    @Column(name = "hang_xe_id")
    private int hangXeId;

//    @ManyToOne
//    @JoinColumn(name = "loai_xe_id")
//    private LoaiX loaiXe;
    @Column(name = "loai_xe_id")
    private int loaiXeId;
    @Column(name = "gia_thue_ngay", nullable = false)
    private Double giaThueNgay;
    @Column(name = "mo_ta")
    private String moTa;
    private String anhdefault;
}
