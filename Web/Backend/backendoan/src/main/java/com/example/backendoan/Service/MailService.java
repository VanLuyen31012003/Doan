package com.example.backendoan.Service;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import jakarta.mail.MessagingException; // Correct import
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public void sendBookingConfirmationEmail(String toEmail, DonDatXe donDatXe, List<ChiTietDonDatXe> chiTietDonDatXes) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Đặt thông tin email
        helper.setTo(toEmail);
        helper.setSubject("Xác nhận đặt xe thành công - Mã đơn: " + donDatXe.getDonDatXeId());
        helper.setFrom("MotoVip2003@gmail.com");

        // Tạo context để truyền dữ liệu vào template
        Context context = new Context();
        context.setVariable("donDatXe", donDatXe);
        context.setVariable("chiTietDonDatXes", chiTietDonDatXes);

        // Render template HTML
        String htmlContent = templateEngine.process("booking-confirmation", context);

        // Đặt nội dung email là HTML
        helper.setText(htmlContent, true);

        // Gửi email
        mailSender.send(message);
    }
    public void sendBookingConfirmationEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true để hỗ trợ HTML nếu cần
        mailSender.send(message);
    }

}