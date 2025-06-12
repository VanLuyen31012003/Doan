package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.DanhGiaRequest;
import com.example.backendoan.Dto.Response.DanhGiaResponse;
import com.example.backendoan.Entity.*;
import com.example.backendoan.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class DanhGiaService {
    @Autowired
    private DanhGiaRepository danhGiaRepository;
    @Autowired
    private MauXeRepository mauXeRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private  DonDatXeRepository donDatXeRepository;
    @Autowired
    private ChiTietDonDatXeRepository chiTietDonDatXeRepository;
    @Autowired
    private  XeRepository xeRepository;
    //tim cac  danh gia theo mau xe id
    public Page<DanhGiaResponse> getDanhGiaByMauXeIdAndSoSao(Integer mauXeId, Integer soSao, Pageable pageable) {
        // Kiểm tra xem mauXeId có tồn tại không
        MauXe mauXe = mauXeRepository.findById(mauXeId)
                .orElseThrow(() -> new IllegalArgumentException("Mẫu xe với ID " + mauXeId + " không tồn tại"));

        // Truy vấn dữ liệu phân trang
        Page<DanhGia> danhGiaPage;
        if (soSao != null) {
            danhGiaPage = danhGiaRepository.findByMauXeIdAndSoSao(mauXeId, soSao, pageable);
        } else {
            danhGiaPage = danhGiaRepository.findByMauXeId(mauXeId, pageable);
        }

        // Chuyển đổi sang DanhGiaResponse
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return danhGiaPage.map(danhGia -> {
            String hoTenKhachHang = khachHangRepository.findById(danhGia.getKhachHangId())
                    .map(khachHang -> khachHang.getHoTen())
                    .orElse("Không xác định");
            return DanhGiaResponse.builder()
                    .danhGiaId(danhGia.getDanhGiaId())
                    .khachHangId(danhGia.getKhachHangId())
                    .hoTenKhachHang(hoTenKhachHang)
                    .mauXeId(danhGia.getMauXeId())
                    .soSao(danhGia.getSoSao())
                    .binhLuan(danhGia.getBinhLuan())
                    .ngayDanhGia(danhGia.getNgayDanhGia().format(formatter))
                    .build();
        });
//        --------------------ddham creat danh gia

    }
    public DanhGiaResponse createDanhGia(DanhGiaRequest danhGiaRequest) {
        //
        // Kiểm tra KhachHang và MauXe có tồn tại không
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Optional<KhachHang> khachHang = khachHangRepository.findByEmail(name);
        KhachHang khachHang1 = khachHang.orElseThrow(() ->
                new RuntimeException("Không tìm thấy khách hàng với email: " + name));

        MauXe mauXe = mauXeRepository.findById(danhGiaRequest.getMauXeId())
                .orElseThrow(() -> new IllegalArgumentException("Mẫu xe với ID " + danhGiaRequest.getMauXeId() + " không tồn tại"));

        // Kiểm tra điều kiện: Khách hàng phải đặt đơn có mẫu xe đó
        boolean hasOrderedMauXe = false;
        // Lấy danh sách đơn đặt xe của khách hàng
        List<DonDatXe> donDatXeList = donDatXeRepository.findByKhachHangId(khachHang1.getKhachHangId());
        for (DonDatXe donDatXe : donDatXeList) {
            // Lấy chi tiết đơn đặt xe
            List<ChiTietDonDatXe> chiTietList = chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXe.getDonDatXeId());
            for (ChiTietDonDatXe chiTiet : chiTietList) {
                // Lấy thông tin xe
                Xe xe = xeRepository.findById(chiTiet.getXeId())
                        .orElseThrow(() -> new IllegalArgumentException("Xe với ID " + chiTiet.getXeId() + " không tồn tại"));
                // Kiểm tra xem xe có thuộc mẫu xe cần đánh giá không
                if (xe.getMauXe().getMauXeId().equals(danhGiaRequest.getMauXeId())) {
                    hasOrderedMauXe = true;
                    break;
                }
            }
            if (hasOrderedMauXe) break;
        }
        // Nếu không thỏa mãn điều kiện, ném ngoại lệ
        if (!hasOrderedMauXe) {

            throw new IllegalStateException("Bạn chưa thuê " + mauXeRepository.findById(danhGiaRequest.getMauXeId()).get().getTenMau() + ", không thể đánh giá.");
        }

        // Tạo và lưu đánh giá
        DanhGia danhGia = DanhGia.builder()
                .khachHangId(khachHang1.getKhachHangId())
                .mauXeId(mauXe.getMauXeId())
                .soSao(danhGiaRequest.getSoSao())
                .binhLuan(danhGiaRequest.getBinhLuan())
                .build();

        DanhGia savedDanhGia = danhGiaRepository.save(danhGia);

        // Chuyển đổi sang DanhGiaResponse
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return DanhGiaResponse.builder()
                .danhGiaId(savedDanhGia.getDanhGiaId())
                .khachHangId(savedDanhGia.getKhachHangId())
                .hoTenKhachHang(khachHang1.getHoTen())
                .mauXeId(savedDanhGia.getMauXeId())
                .soSao(savedDanhGia.getSoSao())
                .binhLuan(savedDanhGia.getBinhLuan())
                .ngayDanhGia(savedDanhGia.getNgayDanhGia().format(formatter))
                .build();
    }
    // xoa danh gia
    public void deleteDanhGia(int id) {
        DanhGia danhGia = danhGiaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Danh gia với ID " + id + " không tồn tại"));
        danhGiaRepository.delete(danhGia);
    }

}