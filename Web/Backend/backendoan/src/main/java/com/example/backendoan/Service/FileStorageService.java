package com.example.backendoan.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${app.upload-dir}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // Hoặc trả về đường dẫn mặc định nếu cần
        }

        // Kiểm tra định dạng
        String contentType = file.getContentType();
        if (!contentType.equals("image/jpeg") && !contentType.equals("image/png")) {
            throw new IllegalArgumentException("Chỉ hỗ trợ định dạng JPEG hoặc PNG");
        }

        // Kiểm tra kích thước (5MB)
        if (file.getSize() > 9 * 1024 * 1024) {
            throw new IllegalArgumentException("Kích thước file không được vượt quá 5MB");
        }

        // Tạo tên file duy nhất
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // Tạo thư mục nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Lưu file
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.write(filePath, file.getBytes());
        // Trả về đường dẫn tương đối
        return "/images/" + uniqueFileName;
    }

    public void deleteImage(String filePath) throws IOException {
        if (filePath != null && !filePath.isEmpty()) {
            Path path = Paths.get(uploadDir, filePath.replace("/images/", ""));
            Files.deleteIfExists(path);
        }
    }
}
