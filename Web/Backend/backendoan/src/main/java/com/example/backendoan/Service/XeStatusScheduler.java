package com.example.backendoan.Service;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Enums.TrangThaiDonDatXe;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.ChiTietDonDatXeRepository;
import com.example.backendoan.Repository.DonDatXeRepository;
import com.example.backendoan.Repository.XeRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class XeStatusScheduler {

    private static final Logger logger = LoggerFactory.getLogger(XeStatusScheduler.class);

    @Autowired
    private DonDatXeRepository donDatXeRepository;

    @Autowired
    private ChiTietDonDatXeRepository chiTietDonDatXeRepository;

    @Autowired
    private XeRepository xeRepository;

    // Chạy mỗi giờ
//    @Scheduled(cron = "0 0 * * * ?")
//    @Transactional
//    public void updateXeStatus() {
//        logger.info("Bắt đầu kiểm tra trạng thái xe tại thời điểm: {}", LocalDateTime.now());
//
//        // Lấy các đơn đặt xe đang ở trạng thái da xac nhan  (trang_thai = 2)
//        List<DonDatXe> activeDonDatXeList = donDatXeRepository.findByTrangThai(TrangThaiDonDatXe.DA_XAC_NHAN.getValue());
//
//        LocalDateTime now = LocalDateTime.now();
//
//        for (DonDatXe donDatXe : activeDonDatXeList) {
//            // Kiểm tra nếu ngày kết thúc đã qua
//            if (donDatXe.getNgayKetThuc().isBefore(now)) {
//                logger.info("Đơn đặt xe {} đã hết hạn, cập nhật trạng thái", donDatXe.getDonDatXeId());
//
//                // Cập nhật trạng thái đơn thành HOAN_THANH (trang_thai = 2)
//                donDatXe.setTrangThai(TrangThaiDonDatXe.HOAN_THANH.getValue());
//                donDatXeRepository.save(donDatXe);
//
//                // Lấy danh sách xe liên quan từ chi_tiet_don_dat_xe
//                List<ChiTietDonDatXe> chiTietList = chiTietDonDatXeRepository
//                        .findByDonDatXe_DonDatXeId(donDatXe.getDonDatXeId());
//
//                // Cập nhật trạng thái xe về CHUA_THUE (trang_thai = 0)
//                for (ChiTietDonDatXe chiTiet : chiTietList) {
//                    Xe xe = xeRepository.findById(chiTiet.getXeId())
//                            .orElseThrow(() -> new RuntimeException("Xe không tồn tại: " + chiTiet.getXeId()));
//                    xe.setTrangThai(TrangThaiXe.CHUA_THUE.getValue());
//                    xeRepository.save(xe);
//                    logger.info("Cập nhật trạng thái xe {} về CHUA_THUE", xe.getXeId());
//                }
//            }
//        }
//        logger.info("Hoàn thành kiểm tra trạng thái xe");
//    }
}