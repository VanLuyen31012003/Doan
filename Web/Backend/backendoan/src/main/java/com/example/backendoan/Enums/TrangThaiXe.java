package com.example.backendoan.Enums;

public enum TrangThaiXe {
    CHUA_THUE(0),
    DA_THUE(1);

    private final int value;

    TrangThaiXe(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
