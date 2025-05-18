package com.example.backendoan.Service;

import com.example.backendoan.Dto.Response.KhachHangReponse;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class KhachHangService {
    @Autowired
    KhachHangRepository khachHangRepository;
    //lấy thông tin khách hàng qua token
    public KhachHangReponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Optional<KhachHang> khachHang = khachHangRepository.findByEmail(name);
        KhachHang khachHang1 = khachHang.orElseThrow(() ->
                new RuntimeException("Không tìm thấy khách hàng với email: " + name));
        return KhachHangReponse.builder()
                .id(khachHang1.getKhachHangId())
                .hoTen(khachHang1.getHoTen())
                .email(khachHang1.getEmail())
                .soDienThoai(khachHang1.getSoDienThoai())
                .matKhau(khachHang1.getMatKhau())
                .build();
    }
    // đăng ký tài khoản
    public KhachHangReponse registerKhachHang(KhachHangReponse khachHangReponse) {
        if (khachHangRepository.existsByEmail(khachHangReponse.getEmail())) {
            throw new ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }
        KhachHang khachHang = KhachHang.builder()
                .hoTen(khachHangReponse.getHoTen())
                .email(khachHangReponse.getEmail())
                .soDienThoai(khachHangReponse.getSoDienThoai())
                .matKhau(khachHangReponse.getMatKhau())
                .build();
        KhachHang khachHang1 = khachHangRepository.save(khachHang);
        return KhachHangReponse.builder()
                .hoTen(khachHang1.getHoTen())
                .email(khachHang1.getEmail())
                .soDienThoai(khachHang1.getSoDienThoai())
                .matKhau(khachHang1.getMatKhau())
                .build();
    }
    

}
