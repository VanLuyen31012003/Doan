package com.example.backendoan.Configuration;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

public class Vnpayconfig {
    public static final String vnp_TmnCode = "EEPVJFKB";
    public static final String vnp_HashSecret = "9TKVXANZT7GOWOZ09FFAZQD22TQ2X9IT";
    public static final String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl = "http://localhost:8080/payment/api/payment/vnpay-return";
    public static final String frontendUrl = "http://localhost:3000/payment-result"; // Configure this appropriately

}
