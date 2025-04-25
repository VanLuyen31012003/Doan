package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.MauXeRequest;
import com.example.backendoan.Dto.Response.LoaiXeReponse;
import com.example.backendoan.Dto.Response.MauXeResponse;
import com.example.backendoan.Entity.HangXe;
import com.example.backendoan.Entity.LoaiXe;
import com.example.backendoan.Entity.MauXe;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.HangXeRepository;
import com.example.backendoan.Repository.LoaiXeRepository;
import com.example.backendoan.Repository.MauXeRepository;
import com.example.backendoan.Repository.XeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MauXeService {

    @Autowired
    private MauXeRepository mauXeRepository;

    @Autowired
    private LoaiXeRepository loaiXeRepository;

    @Autowired
    private HangXeRepository hangXeRepository;

    @Autowired
    private XeRepository xeRepository;

    public Page<MauXeResponse> getAllMauXe(Pageable pageable) {
        return mauXeRepository.findAll(pageable).map(mauXe -> {
            // Lấy tên hãng xe
            String tenHangXe = hangXeRepository.findById(mauXe.getHangXeId())
                    .map(HangXe::getTenHang)
                    .orElse("Không xác định");

            // Lấy thông tin loại xe (nếu có)
            LoaiXeReponse loaiXeResponse = loaiXeRepository.findById(mauXe.getLoaiXeId())
                    .map(loaiXe -> LoaiXeReponse.builder()
                            .loaixeXeid(loaiXe.getLoaiXeId())
                            .tenLoaiXe(loaiXe.getTenLoai())
                            .build())
                    .orElse(null);

            // Xây dựng đối tượng MauXeResponse
            return MauXeResponse.builder()
                    .mauXeId(mauXe.getMauXeId())
                    .tenMau(mauXe.getTenMau())
                    .giaThueNgay(mauXe.getGiaThueNgay())
                    .tenHangXe(tenHangXe)
                    .moTa(mauXe.getMoTa())
                    .anhDefault(mauXe.getAnhdefault())
                    .loaiXeReponse(loaiXeResponse)
                    .soLuongxeconlai(xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXe.getMauXeId(), TrangThaiXe.CHUA_THUE.getValue()))
                    .build();
        });
    }
    public MauXeResponse getMauXeById(int mauXeId) {
        MauXe mauXe = mauXeRepository.findById(mauXeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu xe với ID: " + mauXeId));

        // Lấy tên hãng xe
        String tenHangXe = hangXeRepository.findById(mauXe.getHangXeId())
                .map(HangXe::getTenHang)
                .orElse("Không xác định");

        // Lấy thông tin loại xe (nếu có)
        LoaiXeReponse loaiXeResponse = loaiXeRepository.findById(mauXe.getLoaiXeId())
                .map(loaiXe -> LoaiXeReponse.builder()
                        .loaixeXeid(loaiXe.getLoaiXeId())
                        .tenLoaiXe(loaiXe.getTenLoai())
                        .build())
                .orElse(null);

        // Xây dựng đối tượng MauXeResponse
        return MauXeResponse.builder()
                .mauXeId(mauXe.getMauXeId())
                .tenMau(mauXe.getTenMau())
                .giaThueNgay(mauXe.getGiaThueNgay())
                .tenHangXe(tenHangXe)
                .moTa(mauXe.getMoTa())
                .anhDefault(mauXe.getAnhdefault())
                .loaiXeReponse(loaiXeResponse)
                .soLuongxeconlai(xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXe.getMauXeId(), TrangThaiXe.CHUA_THUE.getValue()))
                .build();
    }
    public void deleteMauXe(int mauXeId) {
        MauXe mauXe = mauXeRepository.findById(mauXeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu xe với ID: " + mauXeId));
        mauXeRepository.delete(mauXe);
    }
    public MauXeResponse updateMauXe(int mauXeId, MauXeRequest request) {
        MauXe mauXe = mauXeRepository.findById(mauXeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu xe với ID: " + mauXeId));
        HangXe hangXe = hangXeRepository.findById(request.getHangxeId())
                .orElseThrow(() -> new IllegalArgumentException("Hãng xe không tồn tại"));
        LoaiXe loaiXe = loaiXeRepository.findById(request.getLoaiXeId())
                .orElseThrow(() -> new IllegalArgumentException("Loại xe không tồn tại"));
        // Xử lý upload ảnh
        String anhDefaultPath = null;
        if (request.getAnhDefault() != null && !request.getAnhDefault().isEmpty()) {
            // Tạo tên file duy nhất để tránh trùng lặp
            String originalFileName = request.getAnhDefault().getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Đường dẫn lưu file
            String uploadDir = "src/main/resources/static/images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                try {
                    Files.createDirectories(uploadPath);
                } catch (IOException e) {
                    throw new RuntimeException("Không thể tạo thư mục lưu ảnh", e);
                }
            }

            // Lưu file vào thư mục
            Path filePath = uploadPath.resolve(uniqueFileName);
            try {
                Files.write(filePath, request.getAnhDefault().getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Không thể lưu ảnh", e);
            }

            // Tạo đường dẫn tương đối
            anhDefaultPath = "http://localhost:8080/mauxe/images/" + uniqueFileName;
        }

        // Cập nhật thông tin mẫu xe
        mauXe.setTenMau(request.getTenMau());
        mauXe.setGiaThueNgay(request.getGiaThueNgay());
        mauXe.setMoTa(request.getMoTa());
        mauXe.setAnhdefault(anhDefaultPath);
        mauXe.setHangXeId(hangXe.getHangXeId());
        mauXe.setLoaiXeId(loaiXe.getLoaiXeId());

        // Lưu vào database
        MauXe updatedMauXe = mauXeRepository.save(mauXe);
        LoaiXeReponse loaiXeResponse = LoaiXeReponse.builder()
                .loaixeXeid(loaiXe.getLoaiXeId())
                .tenLoaiXe(loaiXe.getTenLoai())
                .build();

        return MauXeResponse.builder()
                .mauXeId(updatedMauXe.getMauXeId())
                .tenMau(updatedMauXe.getTenMau())
                .tenHangXe(hangXe.getTenHang())
                .loaiXeReponse(loaiXeResponse)
                .giaThueNgay(updatedMauXe.getGiaThueNgay())
                .moTa(updatedMauXe.getMoTa())
                .anhDefault(updatedMauXe.getAnhdefault())
                .build();
    }

    public MauXeResponse createMauXe(MauXeRequest request) throws IOException {
        // Kiểm tra hang_xe_id và loai_xe_id
        HangXe hangXe = hangXeRepository.findById(request.getHangxeId())
                .orElseThrow(() -> new IllegalArgumentException("Hãng xe không tồn tại"));
        LoaiXe loaiXe = loaiXeRepository.findById(request.getLoaiXeId())
                .orElseThrow(() -> new IllegalArgumentException("Loại xe không tồn tại"));

        // Xử lý upload ảnh
        String anhDefaultPath = null;
        if (request.getAnhDefault() != null && !request.getAnhDefault().isEmpty()) {
            // Tạo tên file duy nhất để tránh trùng lặp
            String originalFileName = request.getAnhDefault().getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // Đường dẫn lưu file
            String uploadDir = "src/main/resources/static/images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Lưu file vào thư mục
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.write(filePath, request.getAnhDefault().getBytes());

            // Tạo đường dẫn tương đối
            anhDefaultPath = "http://localhost:8080/mauxe/images/" + uniqueFileName;
        }
        MauXe mauXe = MauXe.builder()
                .tenMau(request.getTenMau())
                .giaThueNgay(request.getGiaThueNgay())
                .moTa(request.getMoTa())
                .anhdefault(anhDefaultPath)
                .hangXeId(hangXe.getHangXeId())
                .loaiXeId(loaiXe.getLoaiXeId())
                .build();

        // Lưu vào database
        MauXe savedMauXe = mauXeRepository.save(mauXe);

        // Tạo MauXeResponse
        LoaiXeReponse loaiXeResponse = LoaiXeReponse.builder()
                .loaixeXeid(loaiXe.getLoaiXeId())
                .tenLoaiXe(loaiXe.getTenLoai())
                .build();

        return MauXeResponse.builder()
                .mauXeId(savedMauXe.getMauXeId())
                .tenMau(savedMauXe.getTenMau())
                .giaThueNgay(savedMauXe.getGiaThueNgay())
                .tenHangXe(hangXe.getTenHang())
                .moTa(savedMauXe.getMoTa())
                .anhDefault(savedMauXe.getAnhdefault())
                .loaiXeReponse(loaiXeResponse)
                .soLuongxeconlai(0) // Mẫu xe mới chưa có xe nào
                .build();
    }
    // lấy danh sách mẫu xe theo loại xe
    public Page<MauXeResponse> getMauXeByLoaiXe(int loaiXeId, Pageable pageable) {
        return mauXeRepository.findByLoaiXeId(loaiXeId, pageable).map(mauXe -> {
            // Lấy tên hãng xe
            String tenHangXe = hangXeRepository.findById(mauXe.getHangXeId())
                    .map(HangXe::getTenHang)
                    .orElse("Không xác định");

            // Lấy thông tin loại xe (nếu có)
            LoaiXeReponse loaiXeResponse = loaiXeRepository.findById(mauXe.getLoaiXeId())
                    .map(loaiXe -> LoaiXeReponse.builder()
                            .loaixeXeid(loaiXe.getLoaiXeId())
                            .tenLoaiXe(loaiXe.getTenLoai())
                            .build())
                    .orElse(null);

            // Xây dựng đối tượng MauXeResponse
            return MauXeResponse.builder()
                    .mauXeId(mauXe.getMauXeId())
                    .tenMau(mauXe.getTenMau())
                    .giaThueNgay(mauXe.getGiaThueNgay())
                    .tenHangXe(tenHangXe)
                    .moTa(mauXe.getMoTa())
                    .anhDefault(mauXe.getAnhdefault())
                    .loaiXeReponse(loaiXeResponse)
                    .soLuongxeconlai(xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXe.getMauXeId(), TrangThaiXe.CHUA_THUE.getValue()))
                    .build();
        });

    }
    public Page<MauXeResponse> searchMauXe(String tenMau, Integer loaiXeId, Integer hangXeId, Pageable pageable) {
        return mauXeRepository.searchMauXe(tenMau, loaiXeId, hangXeId, pageable).map(mauXe -> {
            String tenHangXe = hangXeRepository.findById(mauXe.getHangXeId())
                    .map(HangXe::getTenHang)
                    .orElse("Không xác định");

            LoaiXeReponse loaiXeResponse = loaiXeRepository.findById(mauXe.getLoaiXeId())
                    .map(loaiXe -> LoaiXeReponse.builder()
                            .loaixeXeid(loaiXe.getLoaiXeId())
                            .tenLoaiXe(loaiXe.getTenLoai())
                            .build())
                    .orElse(null);

            return MauXeResponse.builder()
                    .mauXeId(mauXe.getMauXeId())
                    .tenMau(mauXe.getTenMau())
                    .giaThueNgay(mauXe.getGiaThueNgay())
                    .tenHangXe(tenHangXe)
                    .moTa(mauXe.getMoTa())
                    .anhDefault(mauXe.getAnhdefault())
                    .loaiXeReponse(loaiXeResponse)
                    .soLuongxeconlai(xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXe.getMauXeId(), TrangThaiXe.CHUA_THUE.getValue()))
                    .build();
        });
    }
    //lay top 10 mau xe co luot dat nhieu
    public List<MauXeResponse> getTop10MauXeBySoLuotDat() {
        // Tạo Pageable để lấy top 10
        Pageable pageable = PageRequest.of(0, 10); // Trang 0, kích thước 10

        // Lấy top 10 mẫu xe theo soluotdat
        List<MauXe> topMauXeList = mauXeRepository.findTop10ByOrderBySoluotdatDesc(pageable);


        // Chuyển đổi sang MauXeResponse
        return topMauXeList.stream().map(mauXe -> MauXeResponse.builder()
                .mauXeId(mauXe.getMauXeId())
                .tenMau(mauXe.getTenMau())
                .giaThueNgay(mauXe.getGiaThueNgay())
                .tenHangXe(hangXeRepository.findById(mauXe.getHangXeId()).get().getTenHang())
                .moTa(mauXe.getMoTa())
                .loaiXeReponse(loaiXeRepository.findById(mauXe.getLoaiXeId()).map(loaiXe -> LoaiXeReponse
                        .builder()
                        .tenLoaiXe(loaiXe.getTenLoai())
                        .loaixeXeid(loaiXe.getLoaiXeId())
                        .build()).orElseThrow())
                .anhDefault(mauXe.getAnhdefault())
                .soluotdat(mauXe.getSoluotdat())
                .build()
        ).toList();
    }
}