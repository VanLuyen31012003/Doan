package com.example.backendoan.Controller;

import com.example.backendoan.Configuration.Vnpayconfig;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Repository.ChiTietDonDatXeRepository;
import com.example.backendoan.Repository.DonDatXeRepository;
import com.example.backendoan.Repository.KhachHangRepository;
import com.example.backendoan.Service.CurrencyService;
import com.example.backendoan.Service.MailService;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Currency;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    DonDatXeRepository donDatXeRepository;
    @Autowired
    MailService mailService;
    @Autowired
    ChiTietDonDatXeRepository chiTietDonDatXeRepository;
    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    private APIContext apiContext;
    @Autowired
    private CurrencyService currency;

    @GetMapping("/api/payment/create")
    public ResponseEntity<?> createPayment(HttpServletRequest request,
                                            @RequestParam("amount") String amount,
                                           @RequestParam("orderId") String orderId
    ) throws UnsupportedEncodingException {
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
        String fullUrl = request.getRequestURL().toString();
        String queryString = request.getQueryString();
        if (queryString != null) {
            fullUrl += "?" + queryString;
        }
        System.out.println("Full callback URL: " + fullUrl);

        String vnpSecureHash = vnpParams.remove("vnp_SecureHash");

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

        String secureHash = hmacSHA512(Vnpayconfig.vnp_HashSecret, hashData.toString());

        String frontendUrl = Vnpayconfig.frontendUrl;
        String redirectUrl;

        if (secureHash.equals(vnpSecureHash)) {
            String responseCode = vnpParams.get("vnp_ResponseCode");
            String txnRef = vnpParams.get("vnp_TxnRef");
            String amount = vnpParams.get("vnp_Amount"); // Số tiền (đơn vị: VND, chia cho 100)
            String transactionDate = vnpParams.get("vnp_PayDate"); // Ngày giao dịch
            // Giả sử bạn có cách lấy username từ DonDatXe hoặc hệ thống
            String username = "unknown"; // Thay bằng logic lấy username nếu có

            if ("00".equals(responseCode)) {
                DonDatXe donDatXe = donDatXeRepository.findById(Integer.parseInt(txnRef))
                        .orElseThrow(() -> new RuntimeException("Order not found"));
                donDatXe.setTrangThaiThanhToan(1);
                donDatXeRepository.save(donDatXe);
                try {
                    String email = khachHangRepository.findById(donDatXe.getKhachHangId())
                            .get()
                            .getEmail();

                    mailService.sendBookingConfirmationEmail(email, donDatXe, chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXe.getDonDatXeId()));
                } catch (MessagingException e) {
                    System.out.println("Error sending email: " + e.getMessage());
                }

                redirectUrl = String.format("%s?status=success&message=%s&txnRef=%s&amount=%s&transactionDate=%s&username=%s",
                        frontendUrl,
                        URLEncoder.encode("Thanh toán thành công", StandardCharsets.UTF_8),
                        txnRef,
                        amount != null ? amount : "",
                        URLEncoder.encode(transactionDate != null ? transactionDate : "", StandardCharsets.UTF_8),
                        URLEncoder.encode(username, StandardCharsets.UTF_8));
            } else {
                DonDatXe donDatXe = donDatXeRepository.findById(Integer.parseInt(txnRef))
                        .orElseThrow(() -> new RuntimeException("Order not found"));
                donDatXeRepository.delete(donDatXe);
                redirectUrl = String.format("%s?status=error&message=%s&txnRef=%s&amount=%s&transactionDate=%s&username=%s",
                        frontendUrl,
                        URLEncoder.encode("Thanh toán thất bại với mã lỗi: " + responseCode, StandardCharsets.UTF_8),
                        txnRef,
                        amount != null ? amount : "",
                        URLEncoder.encode(transactionDate != null ? transactionDate : "", StandardCharsets.UTF_8),
                        URLEncoder.encode(username, StandardCharsets.UTF_8));
            }
        } else {
            redirectUrl = String.format("%s?status=error&message=%s",
                    frontendUrl,
                    URLEncoder.encode("Dữ liệu không hợp lệ", StandardCharsets.UTF_8));
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .body("Redirecting to frontend...");
    }
   // pay pal paymet
   @PostMapping("/paypal")
   public ResponseEntity createPayment(  @RequestParam("amount") String amount1,
                                 @RequestParam("orderId") String orderId) {

       Amount amount = new Amount();
       // Chuyển đổi VND sang USD
       Double amountUSD = currency.convertVNDToUSD(Double.parseDouble(amount1));
//       Double exchangeRate = currency.getCurrentExchangeRate();
       String exchangeRateString = String.format("%.2f", amountUSD);
       amount.setCurrency("USD");
       amount.setTotal(exchangeRateString); // số tiền

       Transaction transaction = new Transaction();
       transaction.setAmount(amount);
       transaction.setDescription("Thuê xe máy");
       transaction.setCustom(orderId); // ID đơn đặt xe hoặc thông tin khác nếu cần

       List<Transaction> transactions = new ArrayList<>();
       transactions.add(transaction);

       Payer payer = new Payer();
       payer.setPaymentMethod("paypal");

       RedirectUrls redirectUrls = new RedirectUrls();
       redirectUrls.setCancelUrl("http://localhost:8080/payment/paypal/cancel?orderId=" + orderId);
       redirectUrls.setReturnUrl("http://localhost:8080/payment/paypal/success");

       Payment payment = new Payment();
       payment.setIntent("sale");
       payment.setPayer(payer);
       payment.setTransactions(transactions);
       payment.setRedirectUrls(redirectUrls);

       try {
           Payment createdPayment = payment.create(apiContext);
           for (Links link : createdPayment.getLinks()) {
               if (link.getRel().equals("approval_url")) {
                   return ResponseEntity.ok(Map.of("paymentUrl", link.getHref()));
               }
           }
       } catch (PayPalRESTException e) {
           e.printStackTrace();
       }

       return ResponseEntity.badRequest().body("loi khi tao thanh toan paypal");
   }
    @GetMapping("/paypal/success")
    public void paypalSuccess(@RequestParam("paymentId") String paymentId,
                              @RequestParam("PayerID") String payerId,
                              HttpServletResponse response) {
        try {
            // Lấy thông tin thanh toán ban đầu
            Payment payment = Payment.get(apiContext, paymentId);

            // Nếu đã approved thì không cần execute lại
            if ("approved".equals(payment.getState())) {
                String frontendUrl = "http://localhost:3000/paypal-result?status=already_processed";
                response.sendRedirect(frontendUrl);
                return;
            }

            // Nếu chưa thì thực hiện thanh toán
            PaymentExecution paymentExecution = new PaymentExecution();
            paymentExecution.setPayerId(payerId);

            Payment executedPayment = payment.execute(apiContext, paymentExecution);

            if (executedPayment != null && "approved".equals(executedPayment.getState())) {
                Transaction transaction = executedPayment.getTransactions().get(0);
                String customData = transaction.getCustom(); // ID đơn đặt xe bạn đã truyền từ lúc tạo payment
                Integer idondatxe = Integer.parseInt(customData);
                String amount = transaction.getAmount().getTotal();

                // Cập nhật đơn đặt xe
                DonDatXe donDatXe = donDatXeRepository.findById(idondatxe)
                        .orElseThrow(() -> new RuntimeException("Order not found"));
                donDatXe.setTrangThaiThanhToan(1);
                donDatXeRepository.save(donDatXe);
                Double amountVND =  donDatXe.getTongTien().doubleValue();

                // Gửi email xác nhận nếu có
                try {
                    String email = khachHangRepository.findById(donDatXe.getKhachHangId())
                            .get()
                            .getEmail();

                    mailService.sendBookingConfirmationEmail(
                            email,
                            donDatXe,
                            chiTietDonDatXeRepository.findByDonDatXe_DonDatXeId(donDatXe.getDonDatXeId())
                    );
                } catch (MessagingException e) {
                    System.out.println("Lỗi khi gửi email: " + e.getMessage());
                }


                // Redirect về trang React (frontend)
                String frontendUrl = "http://localhost:3000/paypal-result"
                        + "?id=" + idondatxe
                        + "&amount=" + amountVND
                        + "&status=success";
                response.sendRedirect(frontendUrl);
            } else {
                // Thanh toán không thành công
                String frontendUrl = "http://localhost:3000/paypal-result?status=fail";
                response.sendRedirect(frontendUrl);
            }
        } catch (Exception e) {
            e.printStackTrace();
            try {
                String frontendUrl = "http://localhost:3000/paypal-result?status=error";
                response.sendRedirect(frontendUrl);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
    @GetMapping("/paypal/cancel")
    public void paypalCancel(@RequestParam(value = "token", required = false) String token,
                             @RequestParam(value = "orderId", required = false) String orderId,
                             HttpServletResponse response) {
        try {
            System.out.println("Payment cancelled with token: " + token + ", orderId: " + orderId);

            if (orderId != null) {
                try {
                    DonDatXe donDatXe = donDatXeRepository.findById(Integer.parseInt(orderId))
                            .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
                    donDatXeRepository.delete(donDatXe);
                    System.out.println("Order deleted: " + orderId);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid orderId format: " + e.getMessage());
                } catch (RuntimeException e) {
                    System.out.println(e.getMessage());
                }
            } else {
                System.out.println("No orderId provided for cancellation");
            }

            String frontendUrl = "http://localhost:3000/paypal-result"
                    + "?status=cancel"
                    + "&token=" + (token != null ? URLEncoder.encode(token, StandardCharsets.UTF_8) : "null")
                    + (orderId != null ? "&id=" + URLEncoder.encode(orderId, StandardCharsets.UTF_8) : "");
            response.sendRedirect(frontendUrl);
        } catch (IOException e) {
            try {
                String frontendUrl = "http://localhost:3000/paypal-result?status=error";
                response.sendRedirect(frontendUrl);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }






}
