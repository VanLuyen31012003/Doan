package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.MauXeRequest;
import com.example.backendoan.Dto.Response.LoaiXeReponse;
import com.example.backendoan.Dto.Response.MauXeResponse;
import com.example.backendoan.Entity.*;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.criteria.Predicate; // Đảm bảo import đúng Predicate từ JPA

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
    @Autowired
    private AnhXeRepository anhXeRepository;
    @Autowired
    private  ThongTinKyThuatRepository thongTinKyThuatRepository;
    @Autowired
    private ChiTietDonDatXeRepository chiTietDonDatXeRepository;

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
        ThongTinKyThuat thongTinKyThuat = thongTinKyThuatRepository
                .findFirstByMauXeIdOrderByKyThuatIdAsc(mauXeId)
                .orElse(null);
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
        // Lấy danh sách ảnh xe
        List<String> anhXeList = anhXeRepository.findByMauXeId(mauXeId)
                .stream()
                .map(anhXe -> anhXe.getDuongDan())
                .toList();

        // Xây dựng đối tượng MauXeResponse
        return MauXeResponse.builder()
                .mauXeId(mauXe.getMauXeId())
                .tenMau(mauXe.getTenMau())
                .giaThueNgay(mauXe.getGiaThueNgay())
                .tenHangXe(tenHangXe)
                .moTa(mauXe.getMoTa())
                .anhDefault(mauXe.getAnhdefault())
                .loaiXeReponse(loaiXeResponse)
                .anhXeList(anhXeList)
                .thongTinKyThuat(thongTinKyThuat)
                .soLuongxeconlai(xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXe.getMauXeId(), TrangThaiXe.CHUA_THUE.getValue()))
                .build();
    }
    @PreAuthorize("hasRole('ADMIN')")
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
    public Page<MauXeResponse> searchMauXe(String tenMau, Integer loaiXeId, Integer hangXeId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        // Xây dựng truy vấn cơ bản
        Specification<MauXe> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tenMau != null && !tenMau.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("tenMau")), "%" + tenMau.toLowerCase() + "%"));
            }
            if (loaiXeId != null) {
                predicates.add(cb.equal(root.get("loaiXeId"), loaiXeId));
            }
            if (hangXeId != null) {
                predicates.add(cb.equal(root.get("hangXeId"), hangXeId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<MauXe> mauXePage = mauXeRepository.findAll(spec, pageable);

        return mauXePage.map(mauXe -> {
            long soLuongXeConLai = countAvailableCars(mauXe.getMauXeId(), startDate, endDate);
            int intNumber = (int) soLuongXeConLai;


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
                    .soLuongxeconlai(intNumber)
                    .build();
        });
    }

    private long countAvailableCars(Integer mauXeId, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            // Nếu không có khoảng thời gian, trả về số xe chưa thuê theo trạng thái hiện tại (trang_thai = 0)
            return xeRepository.countByMauXe_MauXeIdAndTrangThai(mauXeId, 0);
        }
        System.out.println("MauXeId: " + mauXeId +" StartDate: " + startDate + " EndDate: " + endDate);

        // Lấy tất cả xe thuộc mẫu xe này
        List<Xe> allXe = xeRepository.findByMauXe_MauXeId(mauXeId);
        long totalXe = allXe.size();


        // Lấy danh sách xe_id đã được đặt trong khoảng thời gian
        List<Integer> bookedXeIds = chiTietDonDatXeRepository.findBookedXeIds(mauXeId, startDate, endDate);
        long bookedCount = bookedXeIds.size();
        System.out.println("BookedCount: " + bookedCount);

        return totalXe - bookedCount;
    }
    //lay top 10 mau xe co luot dat nhieu
    public List<MauXeResponse> getTop10MauXeBySoLuotDat(Integer loaixeId) {
        // Tạo Pageable để lấy top 10
        Pageable pageable = PageRequest.of(0, 6); // Trang 0, kích thước 10

        // Lấy top 10 mẫu xe theo soluotdat
        List<MauXe> topMauXeList ;
        if (loaixeId != null) {
            // Nếu có loaiXeId, lấy top 10 theo loaiXeId
            topMauXeList = mauXeRepository.findTop6ByLoaiXeIdOrderBySoluotdatDesc(loaixeId, pageable);
        } else {
            // Nếu không có loaiXeId, lấy top 10 tất cả
            topMauXeList = mauXeRepository.findTop6ByOrderBySoluotdatDesc(pageable);
        }


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
    // up load multifile
    public List<AnhXe> uploadImages(Integer mauXeId, List<MultipartFile> files) throws IOException {
        // Kiểm tra mauXeId có tồn tại không
        MauXe mauXe = mauXeRepository.findById(mauXeId)
                .orElseThrow(() -> new IllegalArgumentException("Mẫu xe với ID " + mauXeId + " không tồn tại"));
        List<AnhXe> uploadedImages = new ArrayList<>();

        // Xử lý từng file
        if(files == null || files.isEmpty()) {
            throw new IllegalArgumentException("Không có file nào được chọn để tải lên");
        }
        String uploadDir = "src/main/resources/static/images/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        for (MultipartFile file : files) {
            String anhDefaultPath = null;
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.write(filePath, file.getBytes());
            anhDefaultPath = "http://localhost:8080/mauxe/images/" + uniqueFileName;

            AnhXe anhXe = AnhXe.builder()
                    .mauXeId(mauXeId)
                    .duongDan(anhDefaultPath)
                    .build();
            uploadedImages.add(anhXeRepository.save(anhXe));
        }

        return uploadedImages;
    }
    public List<LoaiXe> getallLoaiXe ()
    {
        return loaiXeRepository.findAll();
    }
    public List<HangXe> getallhangxe()
    {
        return hangXeRepository.findAll();
    }

}