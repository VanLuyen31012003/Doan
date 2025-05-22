package com.example.backendoan.Dto.Response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KhachHangReponse {
    private int id;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String matKhau;
    private String diaChi;
    private String soCccd;
    private LocalDateTime ngayTao;

}
