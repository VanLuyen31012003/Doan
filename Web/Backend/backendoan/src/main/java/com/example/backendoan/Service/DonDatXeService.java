package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.ChiTietRequest;
import com.example.backendoan.Dto.Request.DonDatXeRequest;
import com.example.backendoan.Dto.Request.GiaHanRequest;
import com.example.backendoan.Dto.Response.ChiTietDonDatXeReponse;
import com.example.backendoan.Dto.Response.DonDatXeResponse;
import com.example.backendoan.Entity.*;
import com.example.backendoan.Enums.PhuongThucThanhToan;
import com.example.backendoan.Enums.TrangThaiThanhToan;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.*;
import jakarta.transaction.Transactional;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.AuthenticationException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonDatXeService {
    @Autowired
    private DonDatXeRepository donDatXeRepository;
    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private XeRepository xeRepository;
    @Autowired
    private MauXeRepository mauXeRepository;
    @Autowired
    private HoaDonGiaHanRepository hoaDonGiaHanRepository;
    @Autowired
    private ChiTietDonDatXeRepository chiTietDonDatXeRepository;

    public List<Xe> findAvailableXeByMauXeId(Integer mauXeId) {
        if (mauXeId == null || mauXeId <= 0) {
            throw new IllegalArgumentException("MauXeId phải là số dương");
        }
        return xeRepository.findByMauXe_MauXeIdAndTrangThai(mauXeId, 0);
    }
    public List<ChiTietDonDatXeReponse> convertchitet(List<ChiTietDonDatXe> chiTietDonDatXes){

        return chiTietDonDatXes.stream().map(t-> ChiTietDonDatXeReponse.builder()
                .chiTietId(t.getChiTietId())
                .xe(xeRepository.findById(t.getXeId()).get())
                .soNgayThue(t.getSoNgayThue())
                .thanhTien(t.getThanhTien())
                .build()).toList();
    }
    public String convertTennguoidung(int id){
        return nguoiDungRepository.findById(id).getHo_ten();
    }
    public String converTenkhachhang(int id){
        return khachHangRepository.findById(id).get().getHoTen();
    }
    public List<DonDatXeResponse> getallDOnDatXe() {
        return donDatXeRepository.findAll().stream().map(t -> {
            Integer nguoiDungId = t.getNguoiDungId();
            String tenNguoiDung = (nguoiDungId != null) ? convertTennguoidung(nguoiDungId) : "Không xác định";
            return  DonDatXeResponse.builder ().
                    donDatXeId(t.getDonDatXeId())
                    .khachHangName(converTenkhachhang(t.getKhachHangId()))
                    .nguoiDungName(tenNguoiDung)
                    .ngayKetThuc(t.getNgayKetThuc())
                    .ngayBatDau(t.getNgayBatDau())
                    .diaDiemNhanXe(t.getDiaDiemNhanXe())
                    .tongTien(t.getTongTien())
                    .trangThai(t.getTrangThai())
                    .build();
//                    t.getDonDatXeId(),
//                    converTenkhachhang(t.getKhachHangId()),
//                    tenNguoiDung,
//                    t.getNgayBatDau(),
//                    t.getNgayKetThuc(),
//                    t.getTongTien(),
//                    t.getTrangThai(),
//                    t.getDiaDiemNhanXe(),


        }).toList();
    }
    public DonDatXeResponse getDonDatXeById(int id) {

        return donDatXeRepository.findById(id).map(t -> {
            Integer nguoiDungId = t.getNguoiDungId();
            String tenNguoiDung = (nguoiDungId != null) ? convertTennguoidung(nguoiDungId) : "Không xác định";
            // so tien can thanh toan = tong tien - hoa don gia han voi trang thai thanh toan - tong tien lan dau voi trang thai thanh toan
            BigDecimal checktongtien = BigDecimal.ZERO;
            if(t.getTrangThaiThanhToan()== TrangThaiThanhToan.DA_THANH_TOAN.getValue()){
                checktongtien = t.getTongTienLandau();

            }
            BigDecimal soTienCanThanhToan = t.getTongTien()
                    .subtract(hoaDonGiaHanRepository.findByDonDatXeId(t.getDonDatXeId()).stream()
                            .filter(hoaDon -> hoaDon.getTrangThaiThanhToan() == TrangThaiThanhToan.DA_THANH_TOAN.getValue())
                            .map(hoaDon -> BigDecimal.valueOf(hoaDon.getTongTienGiaHan())) // Convert Double to BigDecimal
                            .reduce(BigDecimal.ZERO, BigDecimal::add))
                    .subtract(checktongtien);
            return new DonDatXeResponse(
                    t.getDonDatXeId(),
                    converTenkhachhang(t.getKhachHangId()),
                    tenNguoiDung,
                    t.getNgayBatDau(),
                    t.getNgayKetThuc(),
                    t.getTongTien(),
                    t.getTrangThai(),
                    t.getDiaDiemNhanXe(),
                    convertchitet(t.getChiTiet()),
                    t.getPhuongThucThanhToan(),
                    t.getTrangThaiThanhToan(),
                    t.getTongTienLandau(),
                    hoaDonGiaHanRepository.findByDonDatXeId(t.getDonDatXeId()),
                    soTienCanThanhToan
            );
        }).orElse(null);
    }

    @Transactional
    public DonDatXeResponse addDonDatXe(DonDatXeRequest donDatXe) {
        // lay thong tin nguoi theo token
        var context= SecurityContextHolder.getContext();
        String name=context.getAuthentication().getName();
        Optional<KhachHang> email =khachHangRepository.findByEmail(name);
        KhachHang khachHang = email.orElseThrow(() ->
                new RuntimeException("Không tìm thấy người dùng với email: " + name));
        // Lấy ngày hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Validate 1: Ngày kết thúc phải lớn hơn ngày bắt đầu
        if (!donDatXe.getNgayKetThuc().isAfter(donDatXe.getNgayBatDau())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }

//        // Validate 2: Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại
//        if (donDatXe.getNgayBatDau().isBefore(now) && !donDatXe.getNgayBatDau().isEqual(now)) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại");
//        }

        List<ChiTietDonDatXe> chiTietDonDatXes = new ArrayList<>();
        for (ChiTietRequest chiTietRequest : donDatXe.getChiTiet())  {
            List<Xe> availableXeList = findAvailableXeByMauXeId(chiTietRequest.getMauXeId());
            if (availableXeList.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không có xe nào khả dụng cho mẫu xe này");
            }
            Xe selectedXe = null;
            for (Xe xe : availableXeList) {
                List<DonDatXe>coflictBookings=donDatXeRepository.findConflictingBookings(
                        xe.getXeId(), donDatXe.getNgayBatDau(), donDatXe.getNgayKetThuc());
                if (coflictBookings.isEmpty()) {
                    selectedXe = xe;
                    break;
                }
            }
            if(selectedXe==null){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đã có người đặt xe trước vào thời gian này");
            }
            MauXe mauXe = mauXeRepository.findById(chiTietRequest.getMauXeId()).get();
            mauXe.setSoluotdat(mauXe.getSoluotdat() + 1);
            mauXeRepository.save(mauXe);
            ChiTietDonDatXe chiTiet = ChiTietDonDatXe.builder()
                    .xeId(selectedXe.getXeId())
                    .soNgayThue(chiTietRequest.getSoNgayThue())
                    .thanhTien(chiTietRequest.getThanhTien())
                    .build();
            chiTietDonDatXes.add(chiTiet);
        }

        DonDatXe donDatXe1 = DonDatXe.builder()
                .khachHangId(khachHang.getKhachHangId())
                .nguoiDungId(donDatXe.getNguoiDungId())
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe())
                .chiTiet(chiTietDonDatXes)
                .tongTienLandau(donDatXe.getTongTien())
                .phuongThucThanhToan(donDatXe.getPhuongThucThanhToan())
                .trangThaiThanhToan(TrangThaiThanhToan.CHUA_THANH_TOAN.getValue())
                .build();
        for (ChiTietDonDatXe chiTiet : chiTietDonDatXes) {
            chiTiet.setDonDatXe(donDatXe1);
        }
        DonDatXe d = donDatXeRepository.save(donDatXe1);
        return DonDatXeResponse.builder()
                .donDatXeId(d.getDonDatXeId())
                .khachHangName(converTenkhachhang(d.getKhachHangId()))
                .nguoiDungName(convertTennguoidung(d.getNguoiDungId()))
                .ngayBatDau(d.getNgayBatDau())
                .ngayKetThuc(d.getNgayKetThuc())
                .tongTien(d.getTongTien())
                .trangThai(d.getTrangThai())
                .diaDiemNhanXe(d.getDiaDiemNhanXe())
                .chiTiet(convertchitet(d.getChiTiet()))
                .phuongThucThanhToan(d.getPhuongThucThanhToan())
                .trangThaiThanhToan(d.getTrangThaiThanhToan())
                .tongTienLandau(d.getTongTienLandau())
                .hoaDonGiaHan(hoaDonGiaHanRepository.findByDonDatXeId(d.getDonDatXeId()))
                .build();
    }

    public DonDatXeResponse updateDonDatXe(int id, DonDatXeRequest donDatXe) {
        DonDatXe donDatXe1 = donDatXeRepository.findById(id).get();
        donDatXe1.setKhachHangId(donDatXe.getKhachHangId());
        donDatXe1.setNguoiDungId(donDatXe.getNguoiDungId());
        donDatXe1.setNgayBatDau(donDatXe.getNgayBatDau());
        donDatXe1.setNgayKetThuc(donDatXe.getNgayKetThuc());
        donDatXe1.setTongTien(donDatXe.getTongTien());
        donDatXe1.setTrangThai(donDatXe.getTrangThai());
        donDatXe1.setDiaDiemNhanXe(donDatXe.getDiaDiemNhanXe());

        DonDatXe updatedDonDatXe = donDatXeRepository.save(donDatXe1);

        return new DonDatXeResponse(
                updatedDonDatXe.getDonDatXeId(),
                converTenkhachhang(updatedDonDatXe.getKhachHangId()),
                convertTennguoidung(updatedDonDatXe.getNguoiDungId()),
                updatedDonDatXe.getNgayBatDau(),
                updatedDonDatXe.getNgayKetThuc(),
                updatedDonDatXe.getTongTien(),
                updatedDonDatXe.getTrangThai(),
                updatedDonDatXe.getDiaDiemNhanXe(),
                convertchitet(updatedDonDatXe.getChiTiet()),
                updatedDonDatXe.getPhuongThucThanhToan(),
                updatedDonDatXe.getTrangThaiThanhToan(),
                updatedDonDatXe.getTongTienLandau(),
                hoaDonGiaHanRepository.findByDonDatXeId(updatedDonDatXe.getDonDatXeId()),
                null

        );

    }
    public void deleteDonDatXe(int id) {
        DonDatXe donDatXe = donDatXeRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt xe với id: " + id));
        donDatXeRepository.delete(donDatXe);
    }
    public List<DonDatXeResponse> getDonDatXeByKhachangId(Integer khachHangId) {
        nguoiDungRepository.findById(khachHangId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với id: " + khachHangId));
        List<DonDatXe> donDatXes = donDatXeRepository.findByKhachHangId(khachHangId);
        return donDatXes.stream().map(donDatXe -> DonDatXeResponse.builder()
                .donDatXeId(donDatXe.getDonDatXeId())
                .khachHangName(converTenkhachhang(donDatXe.getKhachHangId()))
                .nguoiDungName(convertTennguoidung(donDatXe.getNguoiDungId()))
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe())
//                .chiTiet(convertchitet(donDatXe.getChiTiet()))
                .build()).collect(Collectors.toList());
    }
    public List<DonDatXeResponse> getDonDatXeByToken(){
        var context= SecurityContextHolder.getContext();
        String name=context.getAuthentication().getName();
        Integer khachHangId = khachHangRepository.findByEmail(name).get().getKhachHangId();
        List<DonDatXe> donDatXes = donDatXeRepository.findByKhachHangId(khachHangId);
        return donDatXes.stream().map(donDatXe -> DonDatXeResponse.builder()
                .donDatXeId(donDatXe.getDonDatXeId())
                .khachHangName(converTenkhachhang(donDatXe.getKhachHangId()))
                .nguoiDungName(convertTennguoidung(donDatXe.getNguoiDungId()))
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe()).build()).collect(Collectors.toList());
    }
    @Transactional
    public Double giaHanDonDatXe(Integer donDatXeId, GiaHanRequest giaHanRequest) {
        DonDatXe donDatXe = donDatXeRepository.findById(donDatXeId)
                .orElseThrow(() -> new IllegalArgumentException("Đơn không tồn tại"));
        if (donDatXe.getTrangThai() != 4) {
            throw new IllegalArgumentException("Đơn chưa thuê  khách không thể gia hạn");
        }

        List<ChiTietDonDatXe> chiTiet = chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXeId);
        if (chiTiet.isEmpty()) {
            throw new IllegalArgumentException("Chi tiết đơn không tồn tại");
        }
        //lay danh sach cac gia han
        List<HoaDonGiaHan> hoaDonGiaHans = hoaDonGiaHanRepository.findByDonDatXeId(donDatXeId);
        if (hoaDonGiaHans != null && !hoaDonGiaHans.isEmpty()) {
                    throw new IllegalArgumentException("Không thể gia hạn thêm, vui lòng hoàn trả xe đúng thời hạn");
        }

        List<Integer> xeIds = chiTiet.stream().map(ChiTietDonDatXe::getXeId).collect(Collectors.toList());
        LocalDateTime newEndDate = giaHanRequest.getNewEndDate();
        LocalDateTime currentEndDate = donDatXe.getNgayKetThuc();

        if (newEndDate.isBefore(currentEndDate)) {
            throw new IllegalArgumentException("Ngày kết thúc mới phải lớn hơn");
        }
       for(Integer xeId :xeIds){
           List<DonDatXe> conflictingBookings = donDatXeRepository.findConflictingBookings(
                   xeId, currentEndDate, newEndDate);
           if (!conflictingBookings.isEmpty()) {
               throw new IllegalArgumentException("xe đã được đặt trước vào thời gian này ");
           }
       }
        long daysExtended = java.time.temporal.ChronoUnit.DAYS.between(currentEndDate, newEndDate);
       Double tongTienGiaHan =0.0;
        for (ChiTietDonDatXe chiTiet1 : chiTiet) {
            Integer xeId = chiTiet1.getXeId();
            MauXe mauXe =xeRepository.findById(xeId).get().getMauXe();
            Double giaThueNgay = mauXe.getGiaThueNgay();
            Double tongTienGiaHanSon = giaThueNgay * daysExtended;
            tongTienGiaHan += tongTienGiaHanSon;
        }
        // Cập nhật trạng thái xe


        // Cập nhật đơn đặt xe
        donDatXe.setNgayKetThuc(newEndDate);
        BigDecimal tongTienGiaHanDecimal = BigDecimal.valueOf(tongTienGiaHan);

        donDatXe.setTongTien(donDatXe.getTongTien().add(tongTienGiaHanDecimal));
        donDatXeRepository.save(donDatXe);

        // Tạo hóa đơn gia hạn
        HoaDonGiaHan hoaDonGiaHan = HoaDonGiaHan.builder()
                .donDatXeId(donDatXeId)
                .ngayBatDauGiaHan(currentEndDate)
                .ngayKetThucGiaHan(newEndDate)
                .tongTienGiaHan(tongTienGiaHan)
                .trangThaiThanhToan(0) // Chưa thanh toán
                .phuongThucThanhToan(null) // Chưa có phương thức
                .build();
        hoaDonGiaHanRepository.save(hoaDonGiaHan);

        return tongTienGiaHan;
    }
}
