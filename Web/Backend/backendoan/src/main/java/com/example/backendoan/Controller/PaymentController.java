package com.example.backendoan.Controller;

import com.example.backendoan.Configuration.Vnpayconfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @GetMapping("/api/payment/create")
    public ResponseEntity<?> createPayment(HttpServletRequest request,
                                            @RequestParam("amount") String amount,
                                           @RequestParam("orderId") String orderId
    ) throws UnsupportedEncodingException {
//        String orderId = String.valueOf(System.currentTimeMillis()); // Mã đơn hàng
//        String amount = "10000000"; // Số tiền: 1000.00đ (nhân 100 lần)

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", Vnpayconfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount",String.valueOf(Long.parseLong(amount) * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", "Thanh toán đơn đặt xe: " + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", Vnpayconfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", request.getRemoteAddr());
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        // Bước 1: Sắp xếp tham số theo thứ tự alphabet
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String name : fieldNames) {
            String value = vnp_Params.get(name);
            if ((value != null) && (value.length() > 0)) {
                hashData.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII.toString()));
                query.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII.toString()));
                if (!name.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        // Bước 2: Tạo chuỗi hash với HMAC SHA512
        String secureHash = hmacSHA512(Vnpayconfig.vnp_HashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        String paymentUrl = Vnpayconfig.vnp_Url + "?" + query.toString();

        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }
    public static String hmacSHA512(String key, String data) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA512");
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(secretKeySpec);
            byte[] result = mac.doFinal(data.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }
    @GetMapping("/api/payment/vnpay-return")
    public ResponseEntity<String> handleVnpayReturn(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> vnpParams = new HashMap<>();
        Map<String, String[]> fields = request.getParameterMap();
        for (Map.Entry<String, String[]> entry : fields.entrySet()) {
            vnpParams.put(entry.getKey(), entry.getValue()[0]);
        }

        String vnpSecureHash = vnpParams.remove("vnp_SecureHash");

        // Bước 1: Sắp xếp tham số theo thứ tự alphabet
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String name = fieldNames.get(i);
            String value = vnpParams.get(name);
            hashData.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            if (i != fieldNames.size() - 1) {
                hashData.append('&');
            }
        }

        // Bước 2: Tạo chuỗi hash với HMAC SHA512
        String secureHash = hmacSHA512(Vnpayconfig.vnp_HashSecret, hashData.toString());

        // Bước 3: So sánh hash để xác thực dữ liệu
        if (secureHash.equals(vnpSecureHash)) {
            String responseCode = vnpParams.get("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                // Thanh toán thành công
                return ResponseEntity.ok("Thanh toán thành công");
            } else {
                // Thanh toán thất bại
                return ResponseEntity.ok("Thanh toán thất bại với mã lỗi: " + responseCode);
            }
        } else {
            // Dữ liệu không hợp lệ
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Dữ liệu không hợp lệ");
        }
    }



}
