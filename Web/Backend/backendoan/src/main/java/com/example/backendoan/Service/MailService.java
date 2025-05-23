package com.example.backendoan.Service;

import com.example.backendoan.Dto.Response.ChiTietDonDatXeReponse;
import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Repository.KhachHangRepository;
import com.example.backendoan.Repository.XeRepository;
import jakarta.mail.MessagingException; // Correct import
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    @Autowired
    private XeRepository xeRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;

    public void sendBookingConfirmationEmail(String toEmail, DonDatXe donDatXe, List<ChiTietDonDatXe> chiTietDonDatXes) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Đặt thông tin email
        helper.setTo(toEmail);
        helper.setSubject("Xác nhận đặt xe thành công - Mã đơn: " + donDatXe.getDonDatXeId());
        helper.setFrom("MotoVip2003@gmail.com");

        //convert list<chitietdondatxe> t0 list<chitietdondatxereponse>
        List<ChiTietDonDatXeReponse> chiTietDonDatXeReponses = new ArrayList<>();
        for (ChiTietDonDatXe chiTiet : chiTietDonDatXes) {
            ChiTietDonDatXeReponse chiTietReponse = new ChiTietDonDatXeReponse();
            chiTietReponse.setChiTietId(chiTiet.getChiTietId());
            chiTietReponse.setXe(xeRepository.findById(chiTiet.getXeId()).orElse(new Xe()));
            chiTietReponse.setSoNgayThue(chiTiet.getSoNgayThue());
            chiTietReponse.setThanhTien(chiTiet.getThanhTien());
            chiTietDonDatXeReponses.add(chiTietReponse);
        }

        // Lấy tên khách hàng nếu có thể
        String khachHangName = "Quý khách";
        if (donDatXe.getKhachHangId() != null) {
            try {
                KhachHang khachHang = khachHangRepository.findById(donDatXe.getKhachHangId()).orElse(null);
                if (khachHang != null) {
                    khachHangName = khachHang.getHoTen();
                }
            } catch (Exception e) {
                // Nếu không thể lấy được thông tin khách hàng, giữ nguyên tên mặc định
            }
        }

        // Tạo context để truyền dữ liệu vào template
        Context context = new Context();
        context.setVariable("donDatXe", donDatXe);
        context.setVariable("chiTietDonDatXes", chiTietDonDatXeReponses);
        context.setVariable("khachHangName", khachHangName);

        // Render template HTML
        String htmlContent = templateEngine.process("booking-confirmation", context);

        // Đặt nội dung email là HTML
        helper.setText(htmlContent, true);

        // Gửi email
        mailSender.send(message);
    }    public void sendBookingConfirmationEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true để hỗ trợ HTML nếu cần
        mailSender.send(message);
    }

}