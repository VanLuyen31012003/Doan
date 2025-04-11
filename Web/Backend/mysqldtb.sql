CREATE DATABASE thue_xe;
USE thue_xe;

-- Bảng hãng xe
CREATE TABLE hang_xe (
    hang_xe_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_hang VARCHAR(255) NOT NULL
);

-- Bảng loại xe
CREATE TABLE loai_xe (
    loai_xe_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_loai VARCHAR(255) NOT NULL
);

-- Bảng mẫu xe
CREATE TABLE mau_xe (
    mau_xe_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_mau VARCHAR(255) NOT NULL,
    hang_xe_id INT,
    loai_xe_id INT,
    gia_thue_ngay DECIMAL(10,2) NOT NULL,
    mo_ta TEXT,
    FOREIGN KEY (hang_xe_id) REFERENCES hang_xe(hang_xe_id),
    FOREIGN KEY (loai_xe_id) REFERENCES loai_xe(loai_xe_id)
);

-- Bảng xe
CREATE TABLE xe (
    xe_id INT AUTO_INCREMENT PRIMARY KEY,
    bien_so VARCHAR(20) UNIQUE NOT NULL,
    mau_xe_id INT,
    trang_thai INT DEFAULT 0,
    ngay_dang_ky DATE,
    FOREIGN KEY (mau_xe_id) REFERENCES mau_xe(mau_xe_id)
);

-- Bảng ảnh xe (liên kết với mẫu xe)
CREATE TABLE anh_xe (
    anh_xe_id INT AUTO_INCREMENT PRIMARY KEY,
    mau_xe_id INT,
    duong_dan VARCHAR(255) NOT NULL,
    FOREIGN KEY (mau_xe_id) REFERENCES mau_xe(mau_xe_id) ON DELETE CASCADE
);

-- Bảng thông tin kỹ thuật
CREATE TABLE thong_tin_ky_thuat (
    ky_thuat_id INT AUTO_INCREMENT PRIMARY KEY,
    mau_xe_id INT,
    dong_co VARCHAR(255),
    dung_tich INT,
    nhien_lieu VARCHAR(255),
    FOREIGN KEY (mau_xe_id) REFERENCES mau_xe(mau_xe_id) ON DELETE CASCADE
);

-- Bảng khách hàng
CREATE TABLE khach_hang (
    khach_hang_id INT AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    mat_khau VARCHAR(255) NOT NULL
);

-- Bảng người dùng
CREATE TABLE nguoi_dung (
    nguoi_dung_id INT AUTO_INCREMENT PRIMARY KEY,
    ho_ten VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    vai_tro INT NOT NULL
);

-- Bảng đơn đặt xe (thêm cột nguoi_dung_id)
CREATE TABLE don_dat_xe (
    don_dat_xe_id INT AUTO_INCREMENT PRIMARY KEY,
    khach_hang_id INT,
    nguoi_dung_id INT, -- Nhân viên xác nhận đơn
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    tong_tien DECIMAL(10,2) NOT NULL,
    trang_thai INT DEFAULT 0,
    dia_diem_nhan_xe VARCHAR(255) NOT NULL,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(khach_hang_id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

-- Bảng chi tiết đơn đặt xe
CREATE TABLE chi_tiet_don_dat_xe (
    chi_tiet_id INT AUTO_INCREMENT PRIMARY KEY,
    don_dat_xe_id INT,
    xe_id INT,
    so_ngay_thue INT NOT NULL,
    thanh_tien DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (don_dat_xe_id) REFERENCES don_dat_xe(don_dat_xe_id) ON DELETE CASCADE,
    FOREIGN KEY (xe_id) REFERENCES xe(xe_id)
);

-- Bảng đánh giá
CREATE TABLE danh_gia (
    danh_gia_id INT AUTO_INCREMENT PRIMARY KEY,
    khach_hang_id INT,
    mau_xe_id INT,
    so_sao INT CHECK (so_sao BETWEEN 1 AND 5),
    binh_luan TEXT,
    ngay_danh_gia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(khach_hang_id) ON DELETE CASCADE,
    FOREIGN KEY (mau_xe_id) REFERENCES mau_xe(mau_xe_id) ON DELETE CASCADE
);