package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.AuthenRequest;
import com.example.backendoan.Dto.Request.IntrospectRequest;
import com.example.backendoan.Dto.Response.AuthenResponse;
import com.example.backendoan.Dto.Response.IntrospctReponse;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Entity.NguoiDung;
import com.example.backendoan.Repository.KhachHangRepository;
import com.example.backendoan.Repository.NguoiDungRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.Data;
import lombok.experimental.NonFinal;
import org.antlr.v4.runtime.Token;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.print.DocFlavor;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.StringJoiner;

@Service
public class Authenservice {
    private static final Logger log = LoggerFactory.getLogger(Authenservice.class);
    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @NonFinal
    @Value("${jwt.secret}")
    protected String SIGNER_KEY;
//            "1TjXchw5FloeSb63Kc+DFhtARvpWL4jUGCwfGWxuG5SIf/1y/LgJxHnMqaF6A/ij";

    public AuthenResponse authenticatekhach(AuthenRequest authenRequest) {
        try {
            if (khachHangRepository.findByEmail(authenRequest.getUsername()) != null) {
                KhachHang khachHang = khachHangRepository.findByEmail(authenRequest.getUsername()).get();
                if (khachHang.getMatKhau().equals(authenRequest.getPassword())) {
                    var token = generateTokenkhachhang(khachHang);
                    return AuthenResponse.builder().
                            token(token).
                            authenticated(true).
                            build();
                } else return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
            } else return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
        } catch (Exception e) {
            return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
        }
    }

    public AuthenResponse authenticate(AuthenRequest authenRequest) {
        try {
            if (nguoiDungRepository.findByEmail(authenRequest.getUsername()) != null) {
                NguoiDung taiKhoan = nguoiDungRepository.findByEmail(authenRequest.getUsername()).get();
                if (taiKhoan.getMat_khau().equals(authenRequest.getPassword())) {
                    var token = generateToken(taiKhoan);
                    return AuthenResponse.builder().
                            token(token).
                            authenticated(true).
                            build();
                } else return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
            } else return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
        } catch (Exception e) {
            return AuthenResponse.builder().authenticated(false).token("lỗi ").build();
        }
    }

    public IntrospctReponse introspctReponse(IntrospectRequest introspcRequest)
            throws JOSEException, ParseException {
        var token = introspcRequest.getToken();
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        return IntrospctReponse.builder()
                .valid(verified && expityTime.after(new Date()))
                .build();
    }

    private String generateToken(NguoiDung nguoiDung) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(nguoiDung.getEmail())
                .issuer("from " + nguoiDung.getEmail())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(100000, ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("scope", buildScope(nguoiDung))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("lỗi tạo token", e);
            throw new RuntimeException(e);

        }
    }

    private String buildScope(NguoiDung nguoiDung) {
        StringJoiner stringJoiner = new StringJoiner(",");
        if (!CollectionUtils.isEmpty(nguoiDung.getVai_tro()))
            nguoiDung.getVai_tro().forEach(stringJoiner::add);
        return stringJoiner.toString();

    }

    private String generateTokenkhachhang(KhachHang khachHang) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(khachHang.getEmail())
                .issuer("from " + khachHang.getEmail())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(100000, ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("scope", "CUSTOMER")
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("lỗi tạo token", e);
            throw new RuntimeException(e);

        }
    }

}
