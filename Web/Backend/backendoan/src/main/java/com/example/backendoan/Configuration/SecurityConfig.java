package com.example.backendoan.Configuration;

import com.example.backendoan.Enums.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${jwt.secret}")
    protected  String SIGNER_KEY ;
    private final String [] Public_EnpointPost={"/auth/login","/auth/introspect","/auth/loginbykhachhang","/nguoidung/addnguoidung"
            ,"/mauxe/images/**","/khachhang/registerkhachhang"
    };
    private final String [] Public_EnpointGet={"/mauxe/images/**","/nguoidung/getallnguoidung",
            "/mauxe/getallmauxe","/mauxe/gettop10mauxe","/mauxe/getmauxe/**","/mauxe/search",
            "/mauxe/getmauxetheoloaixe/**","/danhgia/getalldanhgiabyid/**","/payment/api/payment/create"
            ,"/payment/api/payment/vnpay-return","/auth/testmail","/xe/getallxe","/api/chat/history","/api/chat/conversations",
            "/similar-mauxe","/dondatxe/gettongdondat","/xe/gettongsoxe"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Kích hoạt CORS
                .csrf(csrf -> csrf.disable()) // Tắt
                .authorizeHttpRequests(requests ->
                requests.requestMatchers(HttpMethod.POST,Public_EnpointPost).permitAll()
                        .requestMatchers(HttpMethod.GET,Public_EnpointGet).permitAll()
//                        .requestMatchers(HttpMethod.GET,"").permitAll()
//                        .requestMatchers(HttpMethod.GET,"/nguoidung/getallnguoidung").
//                        hasAuthority("ROLE_ADMIN")
//                hasAnyRole(Role.ADMIN.name())
                        .anyRequest().authenticated()
        );
        httpSecurity.oauth2ResourceServer(oauth2->
              oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtConverter()))
                );
        httpSecurity.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable());
        return httpSecurity.build();
    }
    @Bean
    JwtAuthenticationConverter jwtConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
                return NimbusJwtDecoder.withSecretKey(secretKeySpec)
                        .macAlgorithm(MacAlgorithm.HS512)
                        .build();
    };
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:3001","http://192.168.65.66:3001","http://192.168.65.66:3000")); // Cho phép origin của React
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả endpoint
        return source;
    }

}

