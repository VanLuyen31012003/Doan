package com.example.backendoan.Service;

import com.example.backendoan.Dto.Response.DanhGiaResponse;
import com.example.backendoan.Entity.DanhGia;
import com.example.backendoan.Entity.MauXe;
import com.example.backendoan.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

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
        public DanhGiaResponse createDanhGia(DanhGiaRequest request) {
            // Kiểm tra KhachHang và MauXe có tồn tại không
            KhachHang khachHang = khachHangRepository.findById(request.getKhachHangId())
                    .orElseThrow(() -> new IllegalArgumentException("Khách hàng với ID " + request.getKhachHangId() + " không tồn tại"));
            MauXe mauXe = mauXeRepository.findById(request.getMauXeId())
                    .orElseThrow(() -> new IllegalArgumentException("Mẫu xe với ID " + request.getMauXeId() + " không tồn tại"));

            // Kiểm tra điều kiện: Khách hàng phải đặt đơn có mẫu xe đó
            boolean hasOrderedMauXe = false;
            // Lấy danh sách đơn đặt xe của khách hàng
            List<DonDatXe> donDatXeList = donDatXeRepository.findByKhachHang_KhachHangId(request.getKhachHangId());
            for (DonDatXe donDatXe : donDatXeList) {
                // Lấy chi tiết đơn đặt xe
                List<ChiTietDonDatXe> chiTietList = chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXe.getDonDatXeId());
                for (ChiTietDonDatXe chiTiet : chiTietList) {
                    // Lấy thông tin xe
                    Xe xe = xeRepository.findById(chiTiet.getXeId())
                            .orElseThrow(() -> new IllegalArgumentException("Xe với ID " + chiTiet.getXeId() + " không tồn tại"));
                    // Kiểm tra xem xe có thuộc mẫu xe cần đánh giá không
                    if (xe.getMauXe().getMauXeId().equals(request.getMauXeId())) {
                        hasOrderedMauXe = true;
                        break;
                    }
                }
                if (hasOrderedMauXe) break;
            }
            // Nếu không thỏa mãn điều kiện, ném ngoại lệ
            if (!hasOrderedMauXe) {
                throw new IllegalStateException("Khách hàng chưa đặt đơn nào có mẫu xe với ID " + request.getMauXeId() + ", không thể đánh giá.");
            }

            // Tạo và lưu đánh giá
            DanhGia danhGia = DanhGia.builder()
                    .khachHang(khachHang)
                    .mauXe(mauXe)
                    .soSao(request.getSoSao())
                    .binhLuan(request.getBinhLuan())
                    .build();

            DanhGia savedDanhGia = danhGiaRepository.save(danhGia);

            // Chuyển đổi sang DanhGiaResponse
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            return DanhGiaResponse.builder()
                    .danhGiaId(savedDanhGia.getDanhGiaId())
                    .khachHangId(savedDanhGia.getKhachHang().getKhachHangId())
                    .hoTenKhachHang(khachHang.getHoTen())
                    .mauXeId(savedDanhGia.getMauXe().getMauXeId())
                    .soSao(savedDanhGia.getSoSao())
                    .binhLuan(savedDanhGia.getBinhLuan())
                    .ngayDanhGia(savedDanhGia.getNgayDanhGia().format(formatter))
                    .build();
        }
    }
}