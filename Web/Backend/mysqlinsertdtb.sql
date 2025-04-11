-- 1. Bảng hãng xe
INSERT INTO hang_xe (ten_hang) VALUES
    ('Honda'),
    ('Yamaha'),
    ('Toyota'),
    ('Suzuki'),
    ('VinFast'),
    ('Kawasaki');

-- 2. Bảng loại xe
INSERT INTO loai_xe (ten_loai) VALUES
    ('Xe máy'),
    ('Ô tô sedan'),
    ('Ô tô SUV'),
    ('Xe tải'),
    ('Xe điện'),
    ('Xe đạp');

-- 3. Bảng mẫu xe
INSERT INTO mau_xe (ten_mau, hang_xe_id, loai_xe_id, gia_thue_ngay, mo_ta) VALUES
    ('Wave Alpha', 1, 1, 150000, 'Xe máy tiết kiệm nhiên liệu, phù hợp đi trong thành phố'),
    ('Sirius', 2, 1, 180000, 'Xe máy thể thao, mạnh mẽ'),
    ('Camry', 3, 2, 1200000, 'Ô tô sedan sang trọng'),
    ('Vitara', 4, 3, 1000000, 'Ô tô SUV đa dụng'),
    ('Lux A2.0', 5, 2, 1500000, 'Xe điện sedan hiện đại'),
    ('Ninja 300', 6, 1, 500000, 'Xe máy phân khối lớn');

-- 4. Bảng xe
INSERT INTO xe (bien_so, mau_xe_id, trang_thai, ngay_dang_ky) VALUES
    ('29A-12345', 1, 0, '2023-01-01'), -- Wave Alpha sẵn sàng
    ('29A-67890', 1, 1, '2023-02-01'), -- Wave Alpha đang thuê
    ('30B-54321', 2, 0, '2023-03-01'), -- Sirius sẵn sàng
    ('51C-98765', 3, 0, '2022-12-15'), -- Camry sẵn sàng
    ('29D-11111', 4, 2, '2023-04-10'), -- Vitara bảo trì
    ('29E-22222', 5, 0, '2023-05-20'); -- Lux A2.0 sẵn sàng

-- 5. Bảng ảnh xe (liên kết với mẫu xe)
INSERT INTO anh_xe (mau_xe_id, duong_dan) VALUES
    (1, 'images/wave_alpha.jpg'),
    (2, 'images/sirius.jpg'),
    (3, 'images/camry.jpg'),
    (4, 'images/vitara.jpg'),
    (5, 'images/lux_a20.jpg'),
    (6, 'images/ninja_300.jpg');

-- 6. Bảng thông tin kỹ thuật
INSERT INTO thong_tin_ky_thuat (mau_xe_id, dong_co, dung_tich, nhien_lieu) VALUES
    (1, '110cc', 110, 'Xăng'),
    (2, '115cc', 115, 'Xăng'),
    (3, 'V6 3.5L', 3500, 'Xăng'),
    (4, '1.6L', 1600, 'Xăng'),
    (5, 'Điện 150kW', 0, 'Điện'),
    (6, '300cc', 300, 'Xăng');

-- 7. Bảng khách hàng
INSERT INTO khach_hang (ho_ten, email, so_dien_thoai, mat_khau) VALUES
    ('Nguyễn Văn A', 'nva@gmail.com', '0909123456', '123456'),
    ('Trần Thị B', 'ttb@gmail.com', '0918234567', 'abc123'),
    ('Lê Văn C', 'lvc@gmail.com', '0937345678', 'pass123'),
    ('Phạm Thị D', 'ptd@gmail.com', '0946456789', '456789'),
    ('Hoàng Văn E', 'hve@gmail.com', '0955567890', 'qwerty'),
    ('Đỗ Thị F', 'dtf@gmail.com', '0966678901', 'zxcvbn');

-- 8. Bảng người dùng
INSERT INTO nguoi_dung (ho_ten, email, mat_khau, vai_tro) VALUES
    ('Admin 1', 'admin1@gmail.com', 'admin123', 0), -- Quản trị
    ('Admin 2', 'admin2@gmail.com', 'admin456', 0), -- Quản trị
    ('Chủ xe 1', 'chuxe1@gmail.com', 'chu123', 1), -- Chủ xe
    ('Chủ xe 2', 'chuxe2@gmail.com', 'chu456', 1), -- Chủ xe
    ('Chủ xe 3', 'chuxe3@gmail.com', 'chu789', 1); -- Chủ xe

-- 9. Bảng đơn đặt xe (có nguoi_dung_id)
INSERT INTO don_dat_xe (khach_hang_id, nguoi_dung_id, ngay_bat_dau, ngay_ket_thuc, tong_tien, trang_thai, dia_diem_nhan_xe) VALUES
    (1, 1, '2025-04-10 08:00:00', '2025-04-12 08:00:00', 300000, 1, 'Hà Nội'), -- Admin 1 xác nhận
    (2, NULL, '2025-04-11 09:00:00', '2025-04-13 09:00:00', 360000, 0, 'TP.HCM'), -- Chưa xác nhận
    (3, 2, '2025-04-12 10:00:00', '2025-04-14 10:00:00', 2400000, 3, 'Đà Nẵng'), -- Admin 2 xác nhận
    (4, 1, '2025-04-13 14:00:00', '2025-04-15 14:00:00', 2000000, 2, 'Hải Phòng'), -- Admin 1 xác nhận
    (5, 2, '2025-04-14 15:00:00', '2025-04-16 15:00:00', 3000000, 1, 'Cần Thơ'); -- Admin 2 xác nhận

-- 10. Bảng chi tiết đơn đặt xe
INSERT INTO chi_tiet_don_dat_xe (don_dat_xe_id, xe_id, so_ngay_thue, thanh_tien) VALUES
    (1, 2, 2, 300000), -- Wave Alpha
    (2, 3, 2, 360000), -- Sirius
    (3, 4, 2, 2400000), -- Camry
    (4, 5, 2, 2000000), -- Vitara
    (5, 6, 2, 3000000); -- Lux A2.0

-- 11. Bảng đánh giá
INSERT INTO danh_gia (khach_hang_id, mau_xe_id, so_sao, binh_luan) VALUES
    (1, 1, 4, 'Xe Wave Alpha chạy ổn, tiết kiệm xăng'),
    (2, 1, 5, 'Rất thích Wave Alpha, dễ lái'),
    (3, 2, 3, 'Sirius mạnh nhưng hơi ồn'),
    (4, 3, 5, 'Camry thoải mái, sang trọng'),
    (5, 5, 4, 'Lux A2.0 hiện đại, nhưng sạc lâu'),
    (6, 6, 5, 'Ninja 300 quá đỉnh, tốc độ cao');