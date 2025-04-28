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
}
