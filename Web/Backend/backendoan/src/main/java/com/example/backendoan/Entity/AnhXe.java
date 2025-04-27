package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "anh_xe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnhXe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anh_xe_id")
    private Integer anhXeId;

//    @ManyToOne
//    @JoinColumn(name = "mau_xe_id")
//    private MauXe mauXe;
    @Column(name = "mau_xe_id")
    private Integer mauXeId;

    @Column(name = "duong_dan", nullable = false)
    private String duongDan;
}
