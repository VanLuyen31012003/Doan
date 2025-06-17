package com.example.backendoan.Service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@Component
public class CurrencyService {

    private static final String EXCHANGE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
    private final RestTemplate restTemplate = new RestTemplate();

    // Cache tỷ giá trong 1 giờ
    private Double cachedRate = 24000.0;
    private LocalDateTime lastUpdate = LocalDateTime.now().minusHours(2);

    public Double convertVNDToUSD(Double amountVND) {
        if (amountVND == null || amountVND <= 0) {
            throw new IllegalArgumentException("Số tiền VND không hợp lệ");
        }

        Double rate = getCurrentExchangeRate();
        Double amountUSD = amountVND / rate;

        // Làm tròn 2 chữ số thập phân
        return Math.round(amountUSD * 100.0) / 100.0;
    }
    public Double convertUSDToVND(Double amountUSD) {
        if (amountUSD == null || amountUSD <= 0) {
            throw new IllegalArgumentException("Số tiền VND không hợp lệ");
        }

        Double rate = getCurrentExchangeRate();
        Double amountVND = amountUSD * rate;

        // Làm tròn 2 chữ số thập phân
        return Math.round(amountVND * 100.0) / 100.0;
    }

    public Double getCurrentExchangeRate() {
        // Nếu cache còn hiệu lực (dưới 1 giờ) thì dùng cache
        if (Duration.between(lastUpdate, LocalDateTime.now()).toHours() < 1) {
            return cachedRate;
        }

        try {
            // Gọi API lấy tỷ giá mới
            ResponseEntity<Map> response = restTemplate.getForEntity(EXCHANGE_API_URL, Map.class);
            Map<String, Object> data = response.getBody();

            if (data != null && data.containsKey("rates")) {
                Map<String, Double> rates = (Map<String, Double>) data.get("rates");
                if (rates.containsKey("VND")) {
                    cachedRate = rates.get("VND");
                    lastUpdate = LocalDateTime.now();
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy tỷ giá: " + e.getMessage());
            // Sử dụng tỷ giá cache cũ nếu có lỗi
        }

        return cachedRate;
    }
}
