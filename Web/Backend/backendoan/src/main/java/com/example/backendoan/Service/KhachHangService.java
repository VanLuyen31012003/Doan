package com.example.backendoan.Service;

import com.example.backendoan.Dto.Response.KhachHangReponse;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
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
                .diaChi(khachHang1.getDiaChi())
                .soCccd(khachHang1.getSoCccd())
                .build();
    }
    //lay all khach hang
    public List<KhachHangReponse> getAllKhachHang() {
        List<KhachHang> khachHangList = khachHangRepository.findAll();
        return khachHangList.stream().map(khachHang -> KhachHangReponse.builder()
                .id(khachHang.getKhachHangId())
                .hoTen(khachHang.getHoTen())
                .email(khachHang.getEmail())
                .soDienThoai(khachHang.getSoDienThoai())
                .matKhau(khachHang.getMatKhau())
                .diaChi(khachHang.getDiaChi())
                .soCccd(khachHang.getSoCccd())
                .ngayTao(khachHang.getNgayTao())
                .build()).toList();
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
                .diaChi(khachHangReponse.getDiaChi())
                .soCccd(khachHangReponse.getSoCccd())
                .ngayTao(LocalDateTime.now())
                .build();
        KhachHang khachHang1 = khachHangRepository.save(khachHang);
        return KhachHangReponse.builder()
                .hoTen(khachHang1.getHoTen())
                .email(khachHang1.getEmail())
                .soDienThoai(khachHang1.getSoDienThoai())
                .matKhau(khachHang1.getMatKhau())
                .build();
    }
    // xoa khach hang
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteKhachHang(int id) {
        khachHangRepository.deleteById(id);
        return "Xóa thành công";
    }
    // sua khach hang
    @PreAuthorize("hasRole('ADMIN')")
    public KhachHangReponse updateKhachHang(int id, KhachHangReponse khachHangReponse) {
        KhachHang khachHang = khachHangRepository.findById(id).orElse(null);
        if (khachHang == null) {
            throw new RuntimeException("Khách hàng không tồn tại");
        }
        khachHang.setHoTen(khachHangReponse.getHoTen());
        khachHang.setEmail(khachHangReponse.getEmail());
        khachHang.setSoDienThoai(khachHangReponse.getSoDienThoai());
        khachHang.setMatKhau(khachHangReponse.getMatKhau());
        khachHang.setDiaChi(khachHangReponse.getDiaChi());
        khachHang.setSoCccd(khachHangReponse.getSoCccd());
        khachHangRepository.save(khachHang);
        return KhachHangReponse.builder()
                .id(khachHang.getKhachHangId())
                .hoTen(khachHang.getHoTen())
                .email(khachHang.getEmail())
                .soDienThoai(khachHang.getSoDienThoai())
                .matKhau(khachHang.getMatKhau())
                .diaChi(khachHang.getDiaChi())
                .soCccd(khachHang.getSoCccd())
                .build();
    }
    // lấy thông tin khách hàng qua id
    public KhachHangReponse getKhachHangById(int id) {
        KhachHang khachHang = khachHangRepository.findById(id).orElse(null);
        if (khachHang == null) {
            throw new RuntimeException("Khách hàng không tồn tại");
        }
        return KhachHangReponse.builder()
                .id(khachHang.getKhachHangId())
                .hoTen(khachHang.getHoTen())
                .email(khachHang.getEmail())
                .soDienThoai(khachHang.getSoDienThoai())
                .matKhau(khachHang.getMatKhau())
                .diaChi(khachHang.getDiaChi())
                .soCccd(khachHang.getSoCccd())
                .ngayTao(khachHang.getNgayTao())
                .build();
    }
    

}
