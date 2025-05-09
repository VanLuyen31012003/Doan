package com.example.backendoan.Enums;

public enum PhuongThucThanhToan {
    TIEN_MAT("Tiền mặt"),
    CHUYEN_KHOAN("Chuyển khoản");


    private final String value;

    PhuongThucThanhToan(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
