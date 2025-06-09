package com.example.backendoan.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RecommendController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Hàm chuẩn hóa Min-Max Scaling
    private double normalize(double value, double min, double max) {
        if (max == min) return 0.5; // Trả về giá trị trung bình thay vì 0
        return (value - min) / (max - min);
    }

    // Hàm chuẩn hóa Z-Score (standardization) - hiệu quả hơn cho dữ liệu có outliers
    private double standardize(double value, double mean, double stdDev) {
        if (stdDev == 0) return 0;
        return (value - mean) / stdDev;
    }

    // Hàm tách kích thước
    private double[] parseKichThuoc(String kichThuoc) {
        if (kichThuoc == null || !kichThuoc.matches("\\d+\\s*x\\s*\\d+\\s*x\\s*\\d+")) {
            return new double[]{0, 0, 0}; // Mặc định nếu không hợp lệ
        }
        String[] parts = kichThuoc.split("\\s*x\\s*");
        return new double[]{
                Double.parseDouble(parts[0]), // Dài
                Double.parseDouble(parts[1]), // Rộng
                Double.parseDouble(parts[2])  // Cao
        };
    }

    // Hàm làm sạch chuỗi
    private String cleanString(String value) {
        if (value == null) return null;
        return value.replaceAll("\\s+", " ").trim();
    }

    // Hàm mã hóa các trường varchar với weighted encoding
    private double encodeString(String value, Map<String, Integer> valueMap, int totalUniqueValues) {
        if (value == null) return 0.5;
        String cleanValue = cleanString(value);
        Integer index = valueMap.computeIfAbsent(cleanValue, k -> valueMap.size());
        return normalize(index, 0, Math.max(totalUniqueValues - 1, 1));
    }

    // Hàm mã hóa he_thong_phanh
    private double encodeHeThongPhanh(String heThongPhanh) {
        if (heThongPhanh == null) return 0.5;
        String cleanValue = cleanString(heThongPhanh);
        if ("Đĩa/Đĩa".equals(cleanValue)) return 1.0;
        if ("Đĩa/Tang trống".equals(cleanValue)) return 0.5;
        return 0.0;
    }

    // Hàm mã hóa nhien_lieu
    private double encodeNhienLieu(String nhienLieu) {
        if (nhienLieu == null) return 0.5;
        String cleanValue = cleanString(nhienLieu);
        if ("Xăng".equals(cleanValue)) return 1.0;
        if ("Điện".equals(cleanValue)) return 0.0;
        return 0.5;
    }

    // Hàm tính thống kê cho việc chuẩn hóa
    private double[] calculateStats(List<Double> values) {
        if (values.isEmpty()) return new double[]{0, 0, 0, 0}; // min, max, mean, stdDev

        double sum = 0;
        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;

        for (double value : values) {
            sum += value;
            min = Math.min(min, value);
            max = Math.max(max, value);
        }

        double mean = sum / values.size();

        // Tính độ lệch chuẩn
        double sumSquaredDiff = 0;
        for (double value : values) {
            sumSquaredDiff += Math.pow(value - mean, 2);
        }
        double stdDev = Math.sqrt(sumSquaredDiff / values.size());

        return new double[]{min, max, mean, stdDev};
    }

    // Hàm tính Weighted Cosine Similarity
    private double calculateWeightedCosineSimilarity(double[] vector1, double[] vector2, double[] weights) {
        if (vector1.length != vector2.length || vector1.length != weights.length) {
            throw new IllegalArgumentException("Vector lengths must match");
        }

        double dotProduct = 0;
        double norm1 = 0;
        double norm2 = 0;

        for (int i = 0; i < vector1.length; i++) {
            double weighted1 = vector1[i] * weights[i];
            double weighted2 = vector2[i] * weights[i];

            dotProduct += weighted1 * weighted2;
            norm1 += weighted1 * weighted1;
            norm2 += weighted2 * weighted2;
        }

        if (norm1 == 0 || norm2 == 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    @GetMapping("/vector-based-enhanced")
    public ResponseEntity<?> getVectorBasedEnhancedRecommendations(@RequestParam("khachHangId") String khachHangId) {
        try {
            // Bước 1: Lấy danh sách mau_xe_id đã đặt
            String bookedSql = "SELECT DISTINCT x.mau_xe_id " +
                    "FROM don_dat_xe ddx " +
                    "JOIN chi_tiet_don_dat_xe ctddx ON ddx.don_dat_xe_id = ctddx.don_dat_xe_id " +
                    "JOIN xe x ON ctddx.xe_id = x.xe_id " +
                    "WHERE ddx.khach_hang_id = ?";
            List<Integer> bookedMauXeIds = jdbcTemplate.queryForList(bookedSql, Integer.class, khachHangId);

            if (bookedMauXeIds.isEmpty()) {
                String popularSql = "SELECT mx.mau_xe_id, mx.ten_mau, mx.gia_thue_ngay, mx.anhdefault, mx.soluotdat, " +
                        "tt.dong_co, tt.tieu_thu_nhien_lieu, tt.dung_tich, tt.trong_luong " +
                        "FROM mau_xe mx " +
                        "LEFT JOIN thong_tin_ky_thuat tt ON mx.mau_xe_id = tt.mau_xe_id " +
                        "WHERE mx.mau_xe_id IN (SELECT mau_xe_id FROM xe WHERE trang_thai = 0) " +
                        "ORDER BY mx.soluotdat DESC " +
                        "LIMIT 5";
                List<Map<String, Object>> popularRecommendations = jdbcTemplate.queryForList(popularSql);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Gợi ý mẫu xe phổ biến",
                        "data", popularRecommendations
                ));
            }

            // Bước 2: Lấy tất cả dữ liệu để tính thống kê cho việc chuẩn hóa
            String allDataSql = "SELECT tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, " +
                    "tt.dung_tich_binh_xang, tt.kich_thuoc, " +
                    "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                    "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                    "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc " +
                    "FROM thong_tin_ky_thuat tt";
            List<Map<String, Object>> allData = jdbcTemplate.queryForList(allDataSql);

            // Tính thống kê cho các trường số
            List<Double> dungTichList = new ArrayList<>();
            List<Double> tieuThuList = new ArrayList<>();
            List<Double> trongLuongList = new ArrayList<>();
            List<Double> binhXangList = new ArrayList<>();
            List<Double> kichThuocDaiList = new ArrayList<>();
            List<Double> kichThuocRongList = new ArrayList<>();
            List<Double> kichThuocCaoList = new ArrayList<>();

            Map<String, Integer> dongCoMap = new HashMap<>();
            Map<String, Integer> kichThuocLopSauMap = new HashMap<>();
            Map<String, Integer> kichThuocLopTruocMap = new HashMap<>();
            Map<String, Integer> loaiDenMap = new HashMap<>();
            Map<String, Integer> loaiHopSoMap = new HashMap<>();
            Map<String, Integer> loaiLopMap = new HashMap<>();
            Map<String, Integer> phuocSauMap = new HashMap<>();
            Map<String, Integer> phuocTruocMap = new HashMap<>();

            for (Map<String, Object> row : allData) {
                // Thu thập dữ liệu số
                if (row.get("dung_tich") != null) {
                    dungTichList.add(((Number) row.get("dung_tich")).doubleValue());
                }
                if (row.get("tieu_thu_nhien_lieu") != null) {
                    tieuThuList.add(((Number) row.get("tieu_thu_nhien_lieu")).doubleValue());
                }
                if (row.get("trong_luong") != null) {
                    trongLuongList.add(((Number) row.get("trong_luong")).doubleValue());
                }
                if (row.get("dung_tich_binh_xang") != null) {
                    binhXangList.add(((Number) row.get("dung_tich_binh_xang")).doubleValue());
                }
                // Xử lý kích thước
                String kichThuoc = (String) row.get("kich_thuoc");
                if (kichThuoc != null) {
                    double[] sizes = parseKichThuoc(kichThuoc);
                    kichThuocDaiList.add(sizes[0]);
                    kichThuocRongList.add(sizes[1]);
                    kichThuocCaoList.add(sizes[2]);
                }
                // Thu thập dữ liệu categorical
                String dongCo = cleanString((String) row.get("dong_co"));
                String kichThuocLopSau = cleanString((String) row.get("kich_thuoc_lop_sau"));
                String kichThuocLopTruoc = cleanString((String) row.get("kich_thuoc_lop_truoc"));
                String loaiDen = cleanString((String) row.get("loai_den"));
                String loaiHopSo = cleanString((String) row.get("loai_hop_so"));
                String loaiLop = cleanString((String) row.get("loai_lop"));
                String phuocSau = cleanString((String) row.get("phuoc_sau"));
                String phuocTruoc = cleanString((String) row.get("phuoc_truoc"));

                if (dongCo != null) dongCoMap.computeIfAbsent(dongCo, k -> dongCoMap.size());
                if (kichThuocLopSau != null) kichThuocLopSauMap.computeIfAbsent(kichThuocLopSau, k -> kichThuocLopSauMap.size());
                if (kichThuocLopTruoc != null) kichThuocLopTruocMap.computeIfAbsent(kichThuocLopTruoc, k -> kichThuocLopTruocMap.size());
                if (loaiDen != null) loaiDenMap.computeIfAbsent(loaiDen, k -> loaiDenMap.size());
                if (loaiHopSo != null) loaiHopSoMap.computeIfAbsent(loaiHopSo, k -> loaiHopSoMap.size());
                if (loaiLop != null) loaiLopMap.computeIfAbsent(loaiLop, k -> loaiLopMap.size());
                if (phuocSau != null) phuocSauMap.computeIfAbsent(phuocSau, k -> phuocSauMap.size());
                if (phuocTruoc != null) phuocTruocMap.computeIfAbsent(phuocTruoc, k -> phuocTruocMap.size());
            }

            // Tính thống kê
            double[] dungTichStats = calculateStats(dungTichList);
            double[] tieuThuStats = calculateStats(tieuThuList);
            double[] trongLuongStats = calculateStats(trongLuongList);
            double[] binhXangStats = calculateStats(binhXangList);
            double[] kichThuocDaiStats = calculateStats(kichThuocDaiList);
            double[] kichThuocRongStats = calculateStats(kichThuocRongList);
            double[] kichThuocCaoStats = calculateStats(kichThuocCaoList);

            // Bước 3: Lấy vector trung bình từ các mẫu xe đã thuê
            String bookedSpecsSql = "SELECT tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, " +
                    "tt.dung_tich_binh_xang, tt.kich_thuoc, " +
                    "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                    "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                    "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc " +
                    "FROM mau_xe mx " +
                    "LEFT JOIN thong_tin_ky_thuat tt ON mx.mau_xe_id = tt.mau_xe_id " +
                    "WHERE mx.mau_xe_id IN (" + String.join(",", bookedMauXeIds.stream().map(String::valueOf).toList()) + ")";
            List<Map<String, Object>> bookedSpecs = jdbcTemplate.queryForList(bookedSpecsSql);

            // Vector 17 chiều với chuẩn hóa cải tiến
            double[] avgVector = new double[17];
            for (Map<String, Object> spec : bookedSpecs) {
                // Sử dụng Z-score normalization thay vì Min-Max để giảm ảnh hưởng của outliers
                avgVector[0] += spec.get("dung_tich") != null ?
                        standardize(((Number) spec.get("dung_tich")).doubleValue(), dungTichStats[2], dungTichStats[3]) : 0;
                avgVector[1] += spec.get("tieu_thu_nhien_lieu") != null ?
                        standardize(((Number) spec.get("tieu_thu_nhien_lieu")).doubleValue(), tieuThuStats[2], tieuThuStats[3]) : 0;
                avgVector[2] += spec.get("trong_luong") != null ?
                        standardize(((Number) spec.get("trong_luong")).doubleValue(), trongLuongStats[2], trongLuongStats[3]) : 0;
                avgVector[3] += spec.get("dung_tich_binh_xang") != null ?
                        standardize(((Number) spec.get("dung_tich_binh_xang")).doubleValue(), binhXangStats[2], binhXangStats[3]) : 0;

                double[] kichThuoc = parseKichThuoc((String) spec.get("kich_thuoc"));
                avgVector[4] += standardize(kichThuoc[0], kichThuocDaiStats[2], kichThuocDaiStats[3]);
                avgVector[5] += standardize(kichThuoc[1], kichThuocRongStats[2], kichThuocRongStats[3]);
                avgVector[6] += standardize(kichThuoc[2], kichThuocCaoStats[2], kichThuocCaoStats[3]);
                avgVector[7] += encodeHeThongPhanh((String) spec.get("he_thong_phanh"));
                avgVector[8] += encodeNhienLieu((String) spec.get("nhien_lieu"));
                avgVector[9] += encodeString((String) spec.get("dong_co"), dongCoMap, dongCoMap.size());
                avgVector[10] += encodeString((String) spec.get("kich_thuoc_lop_sau"), kichThuocLopSauMap, kichThuocLopSauMap.size());
                avgVector[11] += encodeString((String) spec.get("kich_thuoc_lop_truoc"), kichThuocLopTruocMap, kichThuocLopTruocMap.size());
                avgVector[12] += encodeString((String) spec.get("loai_den"), loaiDenMap, loaiDenMap.size());
                avgVector[13] += encodeString((String) spec.get("loai_hop_so"), loaiHopSoMap, loaiHopSoMap.size());
                avgVector[14] += encodeString((String) spec.get("loai_lop"), loaiLopMap, loaiLopMap.size());
                avgVector[15] += encodeString((String) spec.get("phuoc_sau"), phuocSauMap, phuocSauMap.size());
                avgVector[16] += encodeString((String) spec.get("phuoc_truoc"), phuocTruocMap, phuocTruocMap.size());
            }
            int count = bookedSpecs.size();
            for (int i = 0; i < avgVector.length; i++) {
                avgVector[i] /= count;
            }
            System.out.println("Average Vector: " + java.util.Arrays.toString(avgVector));
            // Định nghĩa trọng số cho các features (tất cả bằng nhau để đảm bảo ảnh hưởng đồng đều)
            double[] weights = new double[17];
            for (int i = 0; i < weights.length; i++) {
                weights[i] = 1.0 / 17.0; // Trọng số đều nhau
            }

            // Bước 4: Lấy sở thích
            String preferenceSql = "SELECT mx.loai_xe_id, mx.hang_xe_id " +
                    "FROM don_dat_xe ddx " +
                    "JOIN chi_tiet_don_dat_xe ctddx ON ddx.don_dat_xe_id = ctddx.don_dat_xe_id " +
                    "JOIN xe x ON ctddx.xe_id = x.xe_id " +
                    "JOIN mau_xe mx ON x.mau_xe_id = mx.mau_xe_id " +
                    "WHERE ddx.khach_hang_id = ? " +
                    "GROUP BY mx.loai_xe_id, mx.hang_xe_id " +
                    "ORDER BY COUNT(*) DESC " +
                    "LIMIT 1";
            Map<String, Object> preference = jdbcTemplate.queryForMap(preferenceSql, khachHangId);
            Integer preferredLoaiXeId = (Integer) preference.get("loai_xe_id");
            Integer preferredHangXeId = (Integer) preference.get("hang_xe_id");

            // Bước 5: Tính Weighted Cosine Similarity
            String allSpecsSql = "SELECT mx.mau_xe_id, mx.ten_mau, mx.gia_thue_ngay, mx.anhdefault, mx.soluotdat, " +
                    "tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, tt.dung_tich_binh_xang, " +
                    "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                    "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                    "tt.kich_thuoc, " +
                    "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                    "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                    "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc, " +
                    "mx.loai_xe_id, mx.hang_xe_id " +
                    "FROM mau_xe mx " +
                    "LEFT JOIN thong_tin_ky_thuat tt ON mx.mau_xe_id = tt.mau_xe_id " +
                    "WHERE mx.mau_xe_id NOT IN (" + String.join(",", bookedMauXeIds.stream().map(String::valueOf).toList()) + ") " +
                    "AND mx.mau_xe_id IN (SELECT mau_xe_id FROM xe WHERE trang_thai = 0)";
            List<Map<String, Object>> allSpecs = jdbcTemplate.queryForList(allSpecsSql);

            List<Map<String, Object>> recommendations = new ArrayList<>();
            for (Map<String, Object> spec : allSpecs) {
                double[] currentVector = new double[17];

                // Sử dụng cùng phương pháp chuẩn hóa
                currentVector[0] = spec.get("dung_tich") != null ?
                        standardize(((Number) spec.get("dung_tich")).doubleValue(), dungTichStats[2], dungTichStats[3]) : 0;
                currentVector[1] = spec.get("tieu_thu_nhien_lieu") != null ?
                        standardize(((Number) spec.get("tieu_thu_nhien_lieu")).doubleValue(), tieuThuStats[2], tieuThuStats[3]) : 0;
                currentVector[2] = spec.get("trong_luong") != null ?
                        standardize(((Number) spec.get("trong_luong")).doubleValue(), trongLuongStats[2], trongLuongStats[3]) : 0;
                currentVector[3] = spec.get("dung_tich_binh_xang") != null ?
                        standardize(((Number) spec.get("dung_tich_binh_xang")).doubleValue(), binhXangStats[2], binhXangStats[3]) : 0;

                double[] kichThuoc = parseKichThuoc((String) spec.get("kich_thuoc"));
                currentVector[4] = standardize(kichThuoc[0], kichThuocDaiStats[2], kichThuocDaiStats[3]);
                currentVector[5] = standardize(kichThuoc[1], kichThuocRongStats[2], kichThuocRongStats[3]);
                currentVector[6] = standardize(kichThuoc[2], kichThuocCaoStats[2], kichThuocCaoStats[3]);

                currentVector[7] = encodeHeThongPhanh((String) spec.get("he_thong_phanh"));
                currentVector[8] = encodeNhienLieu((String) spec.get("nhien_lieu"));
                currentVector[9] = encodeString((String) spec.get("dong_co"), dongCoMap, dongCoMap.size());
                currentVector[10] = encodeString((String) spec.get("kich_thuoc_lop_sau"), kichThuocLopSauMap, kichThuocLopSauMap.size());
                currentVector[11] = encodeString((String) spec.get("kich_thuoc_lop_truoc"), kichThuocLopTruocMap, kichThuocLopTruocMap.size());
                currentVector[12] = encodeString((String) spec.get("loai_den"), loaiDenMap, loaiDenMap.size());
                currentVector[13] = encodeString((String) spec.get("loai_hop_so"), loaiHopSoMap, loaiHopSoMap.size());
                currentVector[14] = encodeString((String) spec.get("loai_lop"), loaiLopMap, loaiLopMap.size());
                currentVector[15] = encodeString((String) spec.get("phuoc_sau"), phuocSauMap, phuocSauMap.size());
                currentVector[16] = encodeString((String) spec.get("phuoc_truoc"), phuocTruocMap, phuocTruocMap.size());

                // Tính Weighted Cosine Similarity
                double similarity = calculateWeightedCosineSimilarity(avgVector, currentVector, weights);

                // Boost nhẹ cho sở thích (giảm từ 0.2 xuống 0.1 để không làm méo similarity)
                if ((preferredLoaiXeId != null && spec.get("loai_xe_id").equals(preferredLoaiXeId)) ||
                        (preferredHangXeId != null && spec.get("hang_xe_id").equals(preferredHangXeId))) {
                    similarity += 0.1;
                }
                //neu mau xe id =19
                if (spec.get("mau_xe_id").equals(19)) {
                    System.out.println("=== DEBUG XE 19 ===");
//                    System.out.println("Raw loai_lop: '" + spec.get("loai_lop") + "'");
//                    System.out.println("Cleaned loai_lop: '" + cleanString((String) spec.get("loai_lop")) + "'");
                    System.out.println("Vector xe 19: " + java.util.Arrays.toString(currentVector));
                    System.out.println("Similarity xe 19: " + similarity);
                    System.out.println("==================");
                }
                if (spec.get("mau_xe_id").equals(4)) {
                    System.out.println("=== DEBUG XE 4 ===");
//                    System.out.println("Raw loai_lop: '" + spec.get("loai_lop") + "'");
//                    System.out.println("Cleaned loai_lop: '" + cleanString((String) spec.get("loai_lop")) + "'");
                    System.out.println("Vector xe 4: " + java.util.Arrays.toString(currentVector));
                    System.out.println("Similarity xe 4: " + similarity);
                    System.out.println("==================");
                }
                spec.put("similarity", similarity);
                recommendations.add(spec);
            }

            // Sắp xếp theo similarity và soluotdat
            recommendations.sort((a, b) -> {
                double simA = (Double) a.get("similarity");
                double simB = (Double) b.get("similarity");
                if (Math.abs(simA - simB) < 0.001) { // Nếu similarity gần bằng nhau
                    int soluotdatA = a.get("soluotdat") != null ? (Integer) a.get("soluotdat") : 0;
                    int soluotdatB = b.get("soluotdat") != null ? (Integer) b.get("soluotdat") : 0;
                    return Integer.compare(soluotdatB, soluotdatA);
                }
                return Double.compare(simB, simA);
            });

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Gợi ý mẫu xe dựa trên vector nâng cao thành công",
                    "data", recommendations.subList(0, Math.min(5, recommendations.size()))
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi lấy gợi ý mẫu xe: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/similar-mauxe")
public ResponseEntity<?> getSimilarMauXeRecommendations(@RequestParam("mauXeId") String mauXeId) {
    try {
        Integer mauXeIdInt;
        try {
            mauXeIdInt = Integer.parseInt(mauXeId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "mauXeId không hợp lệ: " + mauXeId
            ));
        }

        // Kiểm tra mauXeId có tồn tại không
        String checkExistSql = "SELECT COUNT(*) FROM mau_xe WHERE mau_xe_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkExistSql, Integer.class, mauXeIdInt);
        if (count == null || count == 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không tìm thấy mẫu xe với ID: " + mauXeId
            ));
        }

        // Bước 1: Lấy tất cả dữ liệu để tính thống kê cho việc chuẩn hóa
        String allDataSql = "SELECT tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, " +
                "tt.dung_tich_binh_xang, tt.kich_thuoc, " +
                "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc " +
                "FROM thong_tin_ky_thuat tt";
        List<Map<String, Object>> allData = jdbcTemplate.queryForList(allDataSql);

        // Tính thống kê cho các trường số
        List<Double> dungTichList = new ArrayList<>();
        List<Double> tieuThuList = new ArrayList<>();
        List<Double> trongLuongList = new ArrayList<>();
        List<Double> binhXangList = new ArrayList<>();
        List<Double> kichThuocDaiList = new ArrayList<>();
        List<Double> kichThuocRongList = new ArrayList<>();
        List<Double> kichThuocCaoList = new ArrayList<>();

        Map<String, Integer> dongCoMap = new HashMap<>();
        Map<String, Integer> kichThuocLopSauMap = new HashMap<>();
        Map<String, Integer> kichThuocLopTruocMap = new HashMap<>();
        Map<String, Integer> loaiDenMap = new HashMap<>();
        Map<String, Integer> loaiHopSoMap = new HashMap<>();
        Map<String, Integer> loaiLopMap = new HashMap<>();
        Map<String, Integer> phuocSauMap = new HashMap<>();
        Map<String, Integer> phuocTruocMap = new HashMap<>();

        for (Map<String, Object> row : allData) {
            // Thu thập dữ liệu số
            if (row.get("dung_tich") != null) {
                dungTichList.add(((Number) row.get("dung_tich")).doubleValue());
            }
            if (row.get("tieu_thu_nhien_lieu") != null) {
                tieuThuList.add(((Number) row.get("tieu_thu_nhien_lieu")).doubleValue());
            }
            if (row.get("trong_luong") != null) {
                trongLuongList.add(((Number) row.get("trong_luong")).doubleValue());
            }
            if (row.get("dung_tich_binh_xang") != null) {
                binhXangList.add(((Number) row.get("dung_tich_binh_xang")).doubleValue());
            }

            // Xử lý kích thước
            String kichThuoc = (String) row.get("kich_thuoc");
            if (kichThuoc != null) {
                double[] sizes = parseKichThuoc(kichThuoc);
                kichThuocDaiList.add(sizes[0]);
                kichThuocRongList.add(sizes[1]);
                kichThuocCaoList.add(sizes[2]);
            }

            // Thu thập dữ liệu categorical
            String dongCo = cleanString((String) row.get("dong_co"));
            String kichThuocLopSau = cleanString((String) row.get("kich_thuoc_lop_sau"));
            String kichThuocLopTruoc = cleanString((String) row.get("kich_thuoc_lop_truoc"));
            String loaiDen = cleanString((String) row.get("loai_den"));
            String loaiHopSo = cleanString((String) row.get("loai_hop_so"));
            String loaiLop = cleanString((String) row.get("loai_lop"));
            String phuocSau = cleanString((String) row.get("phuoc_sau"));
            String phuocTruoc = cleanString((String) row.get("phuoc_truoc"));

            if (dongCo != null) dongCoMap.computeIfAbsent(dongCo, k -> dongCoMap.size());
            if (kichThuocLopSau != null) kichThuocLopSauMap.computeIfAbsent(kichThuocLopSau, k -> kichThuocLopSauMap.size());
            if (kichThuocLopTruoc != null) kichThuocLopTruocMap.computeIfAbsent(kichThuocLopTruoc, k -> kichThuocLopTruocMap.size());
            if (loaiDen != null) loaiDenMap.computeIfAbsent(loaiDen, k -> loaiDenMap.size());
            if (loaiHopSo != null) loaiHopSoMap.computeIfAbsent(loaiHopSo, k -> loaiHopSoMap.size());
            if (loaiLop != null) loaiLopMap.computeIfAbsent(loaiLop, k -> loaiLopMap.size());
            if (phuocSau != null) phuocSauMap.computeIfAbsent(phuocSau, k -> phuocSauMap.size());
            if (phuocTruoc != null) phuocTruocMap.computeIfAbsent(phuocTruoc, k -> phuocTruocMap.size());
        }

        // Tính thống kê
        double[] dungTichStats = calculateStats(dungTichList);
        double[] tieuThuStats = calculateStats(tieuThuList);
        double[] trongLuongStats = calculateStats(trongLuongList);
        double[] binhXangStats = calculateStats(binhXangList);
        double[] kichThuocDaiStats = calculateStats(kichThuocDaiList);
        double[] kichThuocRongStats = calculateStats(kichThuocRongList);
        double[] kichThuocCaoStats = calculateStats(kichThuocCaoList);

        // Bước 2: Lấy thông tin của mẫu xe gốc
        String targetSpecSql = "SELECT mx.mau_xe_id, mx.ten_mau, mx.gia_thue_ngay, mx.anhdefault, mx.soluotdat, " +
                "tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, tt.dung_tich_binh_xang, " +
                "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                "tt.kich_thuoc, " +
                "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc, " +
                "mx.loai_xe_id, mx.hang_xe_id " +
                "FROM mau_xe mx " +
                "LEFT JOIN thong_tin_ky_thuat tt ON mx.mau_xe_id = tt.mau_xe_id " +
                "WHERE mx.mau_xe_id = ?";
        Map<String, Object> targetSpec = jdbcTemplate.queryForMap(targetSpecSql, mauXeIdInt);

        // Tạo vector cho mẫu xe gốc
        double[] targetVector = new double[17];
        targetVector[0] = targetSpec.get("dung_tich") != null ?
                standardize(((Number) targetSpec.get("dung_tich")).doubleValue(), dungTichStats[2], dungTichStats[3]) : 0;
        targetVector[1] = targetSpec.get("tieu_thu_nhien_lieu") != null ?
                standardize(((Number) targetSpec.get("tieu_thu_nhien_lieu")).doubleValue(), tieuThuStats[2], tieuThuStats[3]) : 0;
        targetVector[2] = targetSpec.get("trong_luong") != null ?
                standardize(((Number) targetSpec.get("trong_luong")).doubleValue(), trongLuongStats[2], trongLuongStats[3]) : 0;
        targetVector[3] = targetSpec.get("dung_tich_binh_xang") != null ?
                standardize(((Number) targetSpec.get("dung_tich_binh_xang")).doubleValue(), binhXangStats[2], binhXangStats[3]) : 0;

        double[] kichThuocTarget = parseKichThuoc((String) targetSpec.get("kich_thuoc"));
        targetVector[4] = standardize(kichThuocTarget[0], kichThuocDaiStats[2], kichThuocDaiStats[3]);
        targetVector[5] = standardize(kichThuocTarget[1], kichThuocRongStats[2], kichThuocRongStats[3]);
        targetVector[6] = standardize(kichThuocTarget[2], kichThuocCaoStats[2], kichThuocCaoStats[3]);

        targetVector[7] = encodeHeThongPhanh((String) targetSpec.get("he_thong_phanh"));
        targetVector[8] = encodeNhienLieu((String) targetSpec.get("nhien_lieu"));
        targetVector[9] = encodeString((String) targetSpec.get("dong_co"), dongCoMap, dongCoMap.size());
        targetVector[10] = encodeString((String) targetSpec.get("kich_thuoc_lop_sau"), kichThuocLopSauMap, kichThuocLopSauMap.size());
        targetVector[11] = encodeString((String) targetSpec.get("kich_thuoc_lop_truoc"), kichThuocLopTruocMap, kichThuocLopTruocMap.size());
        targetVector[12] = encodeString((String) targetSpec.get("loai_den"), loaiDenMap, loaiDenMap.size());
        targetVector[13] = encodeString((String) targetSpec.get("loai_hop_so"), loaiHopSoMap, loaiHopSoMap.size());
        targetVector[14] = encodeString((String) targetSpec.get("loai_lop"), loaiLopMap, loaiLopMap.size());
        targetVector[15] = encodeString((String) targetSpec.get("phuoc_sau"), phuocSauMap, phuocSauMap.size());
        targetVector[16] = encodeString((String) targetSpec.get("phuoc_truoc"), phuocTruocMap, phuocTruocMap.size());

        // Định nghĩa trọng số cho các features (tất cả bằng nhau để đảm bảo ảnh hưởng đồng đều)
        double[] weights = new double[17];
        for (int i = 0; i < weights.length; i++) {
            weights[i] = 1.0 / 17.0; // Trọng số đều nhau
        }
        System.out.println("Target Vector: " + java.util.Arrays.toString(targetVector));

        // Bước 3: Lấy sở thích từ mẫu xe gốc
        Integer preferredLoaiXeId = (Integer) targetSpec.get("loai_xe_id");
        Integer preferredHangXeId = (Integer) targetSpec.get("hang_xe_id");

        // Bước 4: Tính Weighted Cosine Similarity với tất cả mẫu xe khác
        String allSpecsSql = "SELECT mx.mau_xe_id, mx.ten_mau, mx.gia_thue_ngay, mx.anhdefault, mx.soluotdat, " +
                "tt.dung_tich, tt.tieu_thu_nhien_lieu, tt.trong_luong, tt.dung_tich_binh_xang, " +
                "TRIM(REGEXP_REPLACE(tt.he_thong_phanh, '[\\s\\t\\n\\r]+', ' ')) as he_thong_phanh, " +
                "TRIM(REGEXP_REPLACE(tt.nhien_lieu, '[\\s\\t\\n\\r]+', ' ')) as nhien_lieu, " +
                "tt.kich_thuoc, " +
                "TRIM(REGEXP_REPLACE(tt.dong_co, '[\\s\\t\\n\\r]+', ' ')) as dong_co, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_sau, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_sau, " +
                "TRIM(REGEXP_REPLACE(tt.kich_thuoc_lop_truoc, '[\\s\\t\\n\\r]+', ' ')) as kich_thuoc_lop_truoc, " +
                "TRIM(REGEXP_REPLACE(tt.loai_den, '[\\s\\t\\n\\r]+', ' ')) as loai_den, " +
                "TRIM(REGEXP_REPLACE(tt.loai_hop_so, '[\\s\\t\\n\\r]+', ' ')) as loai_hop_so, " +
                "TRIM(REGEXP_REPLACE(tt.loai_lop, '[\\s\\t\\n\\r]+', ' ')) as loai_lop, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_sau, '[\\s\\t\\n\\r]+', ' ')) as phuoc_sau, " +
                "TRIM(REGEXP_REPLACE(tt.phuoc_truoc, '[\\s\\t\\n\\r]+', ' ')) as phuoc_truoc, " +
                "mx.loai_xe_id, mx.hang_xe_id " +
                "FROM mau_xe mx " +
                "LEFT JOIN thong_tin_ky_thuat tt ON mx.mau_xe_id = tt.mau_xe_id " +
                "WHERE mx.mau_xe_id != ? " +
                "AND mx.mau_xe_id IN (SELECT mau_xe_id FROM xe WHERE trang_thai = 0)";
        List<Map<String, Object>> allSpecs = jdbcTemplate.queryForList(allSpecsSql, mauXeIdInt);

        List<Map<String, Object>> recommendations = new ArrayList<>();
        for (Map<String, Object> spec : allSpecs) {
            double[] currentVector = new double[17];

            // Sử dụng cùng phương pháp chuẩn hóa
            currentVector[0] = spec.get("dung_tich") != null ?
                    standardize(((Number) spec.get("dung_tich")).doubleValue(), dungTichStats[2], dungTichStats[3]) : 0;
            currentVector[1] = spec.get("tieu_thu_nhien_lieu") != null ?
                    standardize(((Number) spec.get("tieu_thu_nhien_lieu")).doubleValue(), tieuThuStats[2], tieuThuStats[3]) : 0;
            currentVector[2] = spec.get("trong_luong") != null ?
                    standardize(((Number) spec.get("trong_luong")).doubleValue(), trongLuongStats[2], trongLuongStats[3]) : 0;
            currentVector[3] = spec.get("dung_tich_binh_xang") != null ?
                    standardize(((Number) spec.get("dung_tich_binh_xang")).doubleValue(), binhXangStats[2], binhXangStats[3]) : 0;

            double[] kichThuoc = parseKichThuoc((String) spec.get("kich_thuoc"));
            currentVector[4] = standardize(kichThuoc[0], kichThuocDaiStats[2], kichThuocDaiStats[3]);
            currentVector[5] = standardize(kichThuoc[1], kichThuocRongStats[2], kichThuocRongStats[3]);
            currentVector[6] = standardize(kichThuoc[2], kichThuocCaoStats[2], kichThuocCaoStats[3]);

            currentVector[7] = encodeHeThongPhanh((String) spec.get("he_thong_phanh"));
            currentVector[8] = encodeNhienLieu((String) spec.get("nhien_lieu"));
            currentVector[9] = encodeString((String) spec.get("dong_co"), dongCoMap, dongCoMap.size());
            currentVector[10] = encodeString((String) spec.get("kich_thuoc_lop_sau"), kichThuocLopSauMap, kichThuocLopSauMap.size());
            currentVector[11] = encodeString((String) spec.get("kich_thuoc_lop_truoc"), kichThuocLopTruocMap, kichThuocLopTruocMap.size());
            currentVector[12] = encodeString((String) spec.get("loai_den"), loaiDenMap, loaiDenMap.size());
            currentVector[13] = encodeString((String) spec.get("loai_hop_so"), loaiHopSoMap, loaiHopSoMap.size());
            currentVector[14] = encodeString((String) spec.get("loai_lop"), loaiLopMap, loaiLopMap.size());
            currentVector[15] = encodeString((String) spec.get("phuoc_sau"), phuocSauMap, phuocSauMap.size());
            currentVector[16] = encodeString((String) spec.get("phuoc_truoc"), phuocTruocMap, phuocTruocMap.size());

            // Tính Weighted Cosine Similarity
            double similarity = calculateWeightedCosineSimilarity(targetVector, currentVector, weights);

            // Boost nhẹ cho cùng loại xe hoặc cùng hãng xe
            if ((preferredLoaiXeId != null && spec.get("loai_xe_id").equals(preferredLoaiXeId)) ||
                    (preferredHangXeId != null && spec.get("hang_xe_id").equals(preferredHangXeId))) {
                similarity += 0.1;
            }
            //neu mau xe id =19
            if (spec.get("mau_xe_id").equals(10)) {
                System.out.println("=== DEBUG XE 10 ===");
//                    System.out.println("Raw loai_lop: '" + spec.get("loai_lop") + "'");
//                    System.out.println("Cleaned loai_lop: '" + cleanString((String) spec.get("loai_lop")) + "'");
                System.out.println("Vector xe 10: " + java.util.Arrays.toString(currentVector));
                System.out.println("Similarity xe 10: " + similarity);
                System.out.println("==================");
            }
            if (spec.get("mau_xe_id").equals(12)) {
                System.out.println("=== DEBUG XE 12 ===");
//                    System.out.println("Raw loai_lop: '" + spec.get("loai_lop") + "'");
//                    System.out.println("Cleaned loai_lop: '" + cleanString((String) spec.get("loai_lop")) + "'");
                System.out.println("Vector xe 12: " + java.util.Arrays.toString(currentVector));
                System.out.println("Similarity xe 12: " + similarity);
                System.out.println("==================");
            }


            spec.put("similarity", similarity);
            recommendations.add(spec);
        }

        // Sắp xếp theo similarity và soluotdat
        recommendations.sort((a, b) -> {
            double simA = (Double) a.get("similarity");
            double simB = (Double) b.get("similarity");
            if (Math.abs(simA - simB) < 0.001) { // Nếu similarity gần bằng nhau
                int soluotdatA = a.get("soluotdat") != null ? (Integer) a.get("soluotdat") : 0;
                int soluotdatB = b.get("soluotdat") != null ? (Integer) b.get("soluotdat") : 0;
                return Integer.compare(soluotdatB, soluotdatA);
            }
            return Double.compare(simB, simA);
        });

        // Thêm thông tin mẫu xe gốc vào response
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("target_mau_xe", targetSpec);
        responseData.put("similar_mau_xe", recommendations.subList(0, Math.min(5, recommendations.size())));

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Gợi ý mẫu xe tương đồng thành công",
                "data", responseData
        ));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Lỗi khi lấy gợi ý mẫu xe tương đồng: " + e.getMessage()
        ));
    }
}
}