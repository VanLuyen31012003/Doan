package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.ChiTietRequest;
import com.example.backendoan.Dto.Request.DonDatXeRequest;
import com.example.backendoan.Dto.Request.GiaHanRequest;
import com.example.backendoan.Dto.Response.ChiTietDonDatXeReponse;
import com.example.backendoan.Dto.Response.DonDatXeResponse;
import com.example.backendoan.Entity.*;
import com.example.backendoan.Enums.PhuongThucThanhToan;
import com.example.backendoan.Enums.TrangThaiDonDatXe;
import com.example.backendoan.Enums.TrangThaiThanhToan;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.*;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.ILoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



import javax.naming.AuthenticationException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
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
    @Autowired
    private MailService mailService;

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

            // Calculate the amount to be paid
            BigDecimal checktongtien = BigDecimal.ZERO;
            if (t.getTrangThaiThanhToan() == TrangThaiThanhToan.DA_THANH_TOAN.getValue()) {
                checktongtien = t.getTongTienLandau();
            }

            BigDecimal soTienCanThanhToan = t.getTongTien() != null ? t.getTongTien() : BigDecimal.ZERO;
            soTienCanThanhToan = soTienCanThanhToan.subtract(
                    hoaDonGiaHanRepository.findByDonDatXeId(t.getDonDatXeId()).stream()
                            .filter(hoaDon -> hoaDon.getTrangThaiThanhToan() == TrangThaiThanhToan.DA_THANH_TOAN.getValue())
                            .map(hoaDon -> hoaDon.getTongTienGiaHan() != null ? BigDecimal.valueOf(hoaDon.getTongTienGiaHan()) : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
            ).subtract(checktongtien != null ? checktongtien : BigDecimal.ZERO);

            return new DonDatXeResponse(
                    t.getDonDatXeId(),
                    t.getKhachHangId(),
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
        }).orElseThrow(() -> new RuntimeException("Đơn đặt xe không tồn tại với ID: " + id));
    }
    public void deleteDonDatXe(int id) {
        DonDatXe donDatXe = donDatXeRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt xe với id: " + id));
        donDatXeRepository.delete(donDatXe);
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
        if(d.getPhuongThucThanhToan().equals(PhuongThucThanhToan.TIEN_MAT.getValue())){
            try {
                mailService.sendBookingConfirmationEmail(khachHang.getEmail(), d, chiTietDonDatXes);
            } catch (MessagingException e) {
                log.error("Failed to send booking confirmation email: {}", e.getMessage());
                throw new RuntimeException("Unable to send confirmation email", e);
            }

        }
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
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public DonDatXeResponse updateDonDatXe(int id, DonDatXeRequest donDatXe) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(name).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với email: " + name));

        DonDatXe donDatXe1 = donDatXeRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt xe với id: " + id));

        // Lưu trạng thái cũ
        int oldTrangThai = donDatXe1.getTrangThai();

        // Cập nhật thông tin
        donDatXe1.setNguoiDungId(nguoiDung.getNguoi_dung_id());
        donDatXe1.setTrangThai(donDatXe.getTrangThai());
        DonDatXe updatedDonDatXe = donDatXeRepository.save(donDatXe1);

        // Kiểm tra nếu trạng thái thay đổi, gửi email
        if (oldTrangThai != updatedDonDatXe.getTrangThai()) {
            KhachHang khachHang = khachHangRepository.findById(updatedDonDatXe.getKhachHangId()).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng với id: " + updatedDonDatXe.getKhachHangId()));

            try {
                String subject = "Cập nhật trạng thái đơn đặt xe #" + updatedDonDatXe.getDonDatXeId();
                String body = buildEmailBody(updatedDonDatXe.getTrangThai(), updatedDonDatXe);

                mailService.sendBookingConfirmationEmail(khachHang.getEmail(), subject, body);
            } catch (MessagingException e) {
                log.error("Failed to send booking status email: {}", e.getMessage());
                throw new RuntimeException("Unable to send status email", e);
            }
        }

        return new DonDatXeResponse(
                updatedDonDatXe.getDonDatXeId(),
                null,
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
    private String buildEmailBody(int trangThai, DonDatXe donDatXe) {
        StringBuilder body = new StringBuilder();
        body.append("Kính gửi ").append(converTenkhachhang(donDatXe.getKhachHangId())).append(",\n\n");
        body.append("Trạng thái đơn đặt xe #").append(donDatXe.getDonDatXeId()).append(" đã được cập nhật:\n");

        switch (trangThai) {
            case 0: // CHO_XAC_NHAN
                body.append("Trạng thái: Đang chờ xác nhận.\n");
                body.append("Vui lòng chờ quản lý xác nhận đơn của bạn.\n");
                break;
            case 1: // DA_XAC_NHAN
                body.append("Trạng thái: Đã xác nhận.\n");
                body.append("Đơn của bạn đã được chấp thuận. Vui lòng đến nhận xe theo lịch hẹn.\n");
                body.append("Thời gian: ").append(donDatXe.getNgayBatDau()).append(" - ").append(donDatXe.getNgayKetThuc()).append("\n");
                break;
            case 2: // HOAN_THANH
                body.append("Trạng thái: Hoàn thành.\n");
                body.append("Đơn của bạn đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!\n");
                break;
            case 3: // HUY
                body.append("Trạng thái: Đã hủy.\n");
                body.append("Đơn của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ hỗ trợ.\n");
                break;
            case 4: // DANG_THUE
                body.append("Trạng thái: Đang thuê.\n");
                body.append("Đơn của bạn đang trong quá trình thuê. Vui lòng bảo quản xe cẩn thận.\n");
                break;
            default:
                body.append("Trạng thái không xác định.\n");
                break;
        }

        body.append("\nTrân trọng,\nĐội ngũ hỗ trợ");
        return body.toString();
    }

    public List<DonDatXeResponse> getDonDatXeByKhachangId(Integer khachHangId) {
        khachHangRepository.findById(khachHangId).orElseThrow(() ->
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
                .phuongThucThanhToan(donDatXe.getPhuongThucThanhToan())
                .trangThaiThanhToan(donDatXe.getTrangThaiThanhToan())
                .tongTienLandau(donDatXe.getTongTienLandau())
                .hoaDonGiaHan(hoaDonGiaHanRepository.findByDonDatXeId(donDatXe.getDonDatXeId()))

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
            throw new IllegalArgumentException("Bạn không thể gia hạn đơn khi mà đơn chưa ở trạng thái đang thuê");
        }

        List<ChiTietDonDatXe> chiTiet = chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXeId);
        if (chiTiet.isEmpty()) {
            throw new IllegalArgumentException("Chi tiết đơn không tồn tại");
        }

        // Kiểm tra danh sách các hóa đơn gia hạn
        List<HoaDonGiaHan> hoaDonGiaHans = hoaDonGiaHanRepository.findByDonDatXeId(donDatXeId);
        if (hoaDonGiaHans != null && !hoaDonGiaHans.isEmpty()) {
            throw new IllegalArgumentException("Không thể gia hạn thêm, vui lòng hoàn trả xe đúng thời hạn");
        }

        List<Integer> xeIds = chiTiet.stream().map(ChiTietDonDatXe::getXeId).collect(Collectors.toList());
        LocalDateTime newEndDate = giaHanRequest.getNewEndDate();
        LocalDateTime currentEndDate = donDatXe.getNgayKetThuc();

        if (newEndDate.isBefore(currentEndDate)) {
            throw new IllegalArgumentException("Ngày kết thúc mới phải lớn hơn ngày kết thúc hiện tại");
        }

        for (Integer xeId : xeIds) {
            List<DonDatXe> conflictingBookings = donDatXeRepository.findConflictingBookings(
                    xeId, currentEndDate, newEndDate);
            if (!conflictingBookings.isEmpty()) {
                throw new IllegalArgumentException("Xe với biển số: " + xeRepository.findById(xeId).get().getBienSo() + " đã có người đặt trước vào khoảng thời gian gia hạn");
            }
        }

        long daysExtended = java.time.temporal.ChronoUnit.DAYS.between(currentEndDate, newEndDate);
        Double tongTienGiaHan = 0.0;

        for (ChiTietDonDatXe chiTiet1 : chiTiet) {
            Integer xeId = chiTiet1.getXeId();
            MauXe mauXe = xeRepository.findById(xeId).get().getMauXe();
            Double giaThueNgay = mauXe.getGiaThueNgay();
            Double tongTienGiaHanSon = giaThueNgay * daysExtended;
            tongTienGiaHan += tongTienGiaHanSon;
        }

        // Cập nhật đơn đặt xe
        donDatXe.setNgayKetThuc(newEndDate);
        BigDecimal tongTienGiaHanDecimal = BigDecimal.valueOf(tongTienGiaHan);
        donDatXe.setTongTien(donDatXe.getTongTien().add(tongTienGiaHanDecimal));
        DonDatXe updatedDonDatXe = donDatXeRepository.save(donDatXe);

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

        // Gửi email xác nhận gia hạn
        try {
            KhachHang khachHang = khachHangRepository.findById(donDatXe.getKhachHangId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin khách hàng"));
            String subject = "Xác nhận gia hạn đơn đặt xe #" + updatedDonDatXe.getDonDatXeId();
            String body = String.format(
                    "Kính gửi %s,\n\nĐơn đặt xe #%d của bạn đã được gia hạn thành công.\n" +
                            "Thời gian kết thúc mới: %s\n" +
                            "Chi phí gia hạn: %s VNĐ\n" +
                            "Tổng tiền đơn hàng: %s VNĐ\n\nTrân trọng,\nĐội ngũ hỗ trợ",
                    khachHang.getHoTen(),
                    updatedDonDatXe.getDonDatXeId(),
                    updatedDonDatXe.getNgayKetThuc().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    tongTienGiaHan.toString(),
                    updatedDonDatXe.getTongTien().toString()
            );
            mailService.sendBookingConfirmationEmail(khachHang.getEmail(), subject, body);
        } catch (MessagingException e) {
            log.error("Failed to send extension confirmation email: {}", e.getMessage());
            throw new RuntimeException("Không thể gửi email xác nhận gia hạn", e);
        }

        return tongTienGiaHan;
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<DonDatXeResponse> getalldondatbyidxe(int id) {
        Xe xe = xeRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy xe với id: " + id));
        List<DonDatXe> donDatXeList = chiTietDonDatXeRepository.findDonDatXeByXeId(id);
        return donDatXeList.stream().map(donDatXe -> DonDatXeResponse.builder()
                .donDatXeId(donDatXe.getDonDatXeId())
                .khachHangName(converTenkhachhang(donDatXe.getKhachHangId()))
//                .nguoiDungName(convertTennguoidung(donDatXe.getNguoiDungId()))
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe())
//                .chiTiet(convertchitet(donDatXe.getChiTiet()))
                .build()).collect(Collectors.toList());

    }
}
