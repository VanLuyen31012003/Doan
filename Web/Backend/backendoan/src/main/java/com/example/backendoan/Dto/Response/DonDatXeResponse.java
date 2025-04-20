package com.example.backendoan.Dto.Response;

import com.example.backendoan.Entity.ChiTietDonDatXe;
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
//     Integer khachHangId;
     String khachHangName;
//     Integer nguoiDungId;
     String nguoiDungName;
     LocalDateTime ngayBatDau;
     LocalDateTime ngayKetThuc;
     BigDecimal tongTien;
     Integer trangThai = 0;
     String diaDiemNhanXe;
     List<ChiTietDonDatXeReponse> chiTiet = new ArrayList<>();

}
