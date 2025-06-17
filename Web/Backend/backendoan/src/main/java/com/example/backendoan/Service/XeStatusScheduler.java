package com.example.backendoan.Service;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Enums.TrangThaiDonDatXe;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.ChiTietDonDatXeRepository;
import com.example.backendoan.Repository.DonDatXeRepository;
import com.example.backendoan.Repository.KhachHangRepository;
import com.example.backendoan.Repository.XeRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class XeStatusScheduler {

    private static final Logger logger = LoggerFactory.getLogger(XeStatusScheduler.class);
    @Autowired
    private  DonDatXeRepository donDatXeRepository;
    @Autowired
    private  KhachHangRepository khachHangRepository;
    @Autowired
    private  MailService mailService;

    // Chạy vào 8h sáng hàng ngày
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkOverdueRentals() {
        logger.info("Bắt đầu kiểm tra các đơn đặt xe quá hạn lúc: {}", LocalDateTime.now());

        try {
            // Lấy tất cả đơn đặt xe có trạng thái DANG_THUE (4)
            List<DonDatXe> dangThueOrders = donDatXeRepository.findByTrangThai(4);
            LocalDateTime now = LocalDateTime.now();
            int overdueCount = 0;
            int reminderCount = 0;

            for (DonDatXe donDatXe : dangThueOrders) {
                LocalDateTime ngayKetThuc = donDatXe.getNgayKetThuc();

                if (ngayKetThuc != null && ngayKetThuc.isBefore(now)) {
                    // Đơn đã quá hạn
                    sendOverdueEmail(donDatXe, now);
                    overdueCount++;
                } else if (ngayKetThuc != null &&
                        ngayKetThuc.isAfter(now) &&
                        ngayKetThuc.isBefore(now.plusHours(24))) {
                    // Đơn sắp hết hạn trong 24h tới
                    sendReminderEmail(donDatXe, ngayKetThuc);
                    reminderCount++;
                }
            }
            logger.info("Hoàn thành kiểm tra: {} đơn quá hạn, {} đơn sắp hết hạn", overdueCount, reminderCount);

        } catch (Exception e) {
            logger.error("Lỗi khi kiểm tra đơn đặt xe quá hạn: {}", e.getMessage(), e);
        }
    }
    // Gửi email cho đơn quá hạn
    private void sendOverdueEmail(DonDatXe donDatXe, LocalDateTime currentTime) {
        try {
            KhachHang khachHang = khachHangRepository.findById(donDatXe.getKhachHangId())
                    .orElse(null);

            if (khachHang == null || khachHang.getEmail() == null) {
                logger.warn("Không tìm thấy thông tin khách hàng hoặc email cho đơn: {}", donDatXe.getDonDatXeId());
                return;
            }

            String subject = "⚠️ KHẨN CẤP - Đơn thuê xe đã quá hạn #" + donDatXe.getDonDatXeId();

            long overdueDays = java.time.Duration.between(donDatXe.getNgayKetThuc(), currentTime).toDays();

            String body = String.format(
                    "Kính gửi anh/chị %s,\n\n" +
                            "⚠️ ĐƠN THUÊ XE CỦA BẠN ĐÃ QUÁ HẠN ⚠️\n\n" +
                            "📋 Thông tin đơn thuê:\n" +
                            "• Mã đơn: #%s\n" +
                            "• Ngày hết hạn: %s\n" +
                            "• Số ngày quá hạn: %d ngày\n" +
                            "• Tổng tiền đơn: %s VNĐ\n\n" +
                            "🚨 VUI LÒNG TRẢ XE NGAY LẬP TỨC để tránh phát sinh thêm chi phí phạt.\n\n" +
                            "📞 Liên hệ ngay hotline: 0948.310.103\n" +
                            "📧 Email hỗ trợ: MotoVip2003@gmail.com\n" +
                            "📍 Địa chỉ trả xe: %s\n\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ MotoVip",
                    khachHang.getHoTen(),
                    donDatXe.getDonDatXeId(),
                    donDatXe.getNgayKetThuc().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    overdueDays,
                    donDatXe.getTongTien().toString(),
                    donDatXe.getDiaDiemNhanXe()
            );

            mailService.sendBookingConfirmationEmail(khachHang.getEmail(), subject, body);
            logger.info("Đã gửi email quá hạn cho đơn: {} - Email: {}", donDatXe.getDonDatXeId(), khachHang.getEmail());

        } catch (Exception e) {
            logger.error("Lỗi khi gửi email quá hạn cho đơn {}: {}", donDatXe.getDonDatXeId(), e.getMessage());
        }
    }
    // Gửi email nhắc nhở sắp hết hạn
    private void sendReminderEmail(DonDatXe donDatXe, LocalDateTime ngayKetThuc) {
        try {
            KhachHang khachHang = khachHangRepository.findById(donDatXe.getKhachHangId())
                    .orElse(null);

            if (khachHang == null || khachHang.getEmail() == null) {
                return;
            }

            String subject = "🔔 Nhắc nhở trả xe - Đơn #" + donDatXe.getDonDatXeId() + " sắp hết hạn";

            long hoursLeft = java.time.Duration.between(LocalDateTime.now(), ngayKetThuc).toHours();

            String body = String.format(
                    "Kính gửi anh/chị %s,\n\n" +
                            "🔔 NHẮC NHỞ TRẢ XE\n\n" +
                            "📋 Thông tin đơn thuê:\n" +
                            "• Mã đơn: #%s\n" +
                            "• Thời hạn trả xe: %s\n" +
                            "• Thời gian còn lại: %d giờ\n" +
                            "• Tổng tiền đơn: %s VNĐ\n\n" +
                            "📍 Địa điểm trả xe: %s\n\n" +
                            "💡 Lưu ý: Vui lòng trả xe đúng giờ để tránh phát sinh phí phạt.\n\n" +
                            "📞 Hỗ trợ: 0948.310.103\n" +
                            "📧 Email: MotoVip2003@gmail.com\n\n" +
                            "Cảm ơn bạn đã sử dụng dịch vụ!\n\n" +
                            "Trân trọng,\n" +
                            "Đội ngũ MotoVip",
                    khachHang.getHoTen(),
                    donDatXe.getDonDatXeId(),
                    ngayKetThuc.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    hoursLeft,
                    donDatXe.getTongTien().toString(),
                    donDatXe.getDiaDiemNhanXe()
            );

            mailService.sendBookingConfirmationEmail(khachHang.getEmail(), subject, body);
            logger.info("Đã gửi email nhắc nhở cho đơn: {} - Email: {}", donDatXe.getDonDatXeId(), khachHang.getEmail());

        } catch (Exception e) {
            logger.error("Lỗi khi gửi email nhắc nhở cho đơn {}: {}", donDatXe.getDonDatXeId(), e.getMessage());
        }
    }
    // Method để test thủ công (optional)
    public void manualCheckOverdueRentals() {
        logger.info("Kiểm tra thủ công các đơn đặt xe quá hạn");
        checkOverdueRentals();
    }

}