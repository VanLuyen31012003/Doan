package com.example.backendoan.Dto.Response;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.HoaDonGiaHan;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonDatXeResponse {
     Integer donDatXeId;
     Integer idKhachHang;
     String khachHangName;
     String nguoiDungName;
     LocalDateTime ngayBatDau;
     LocalDateTime ngayKetThuc;
     BigDecimal tongTien;
     Integer trangThai = 0;
     String diaDiemNhanXe;
     List<ChiTietDonDatXeReponse> chiTiet = new ArrayList<>();
     String phuongThucThanhToan;
     Integer trangThaiThanhToan;
     BigDecimal tongTienLandau;
     List<HoaDonGiaHan> hoaDonGiaHan;
     BigDecimal soTienCanThanhToan;

}
