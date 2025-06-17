package com.example.backendoan.Configuration;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PayPalConfig {
    private final String clientId = "AeWMZZ9RuAybcUozZUj-L4qSYszjjTFD7eNFia_xqepBfKfleLG3t2ep1uw8AcevCBIYO5gwv8xiibQs";
    private final String clientSecret = "EJNrnnUL1o9ZHLmNF-cciVOlIx9AW-gJJs0gnxeijzRTzMfzBDB5q0HLWdyttZNBzN--v7EPntOVlKru";
    private final String mode = "sandbox"; // hoặc "live" nếu dùng thật

    @Bean
    public Map<String, String> paypalSdkConfig() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("mode", mode);
        return configMap;
    }

    @Bean
    public OAuthTokenCredential authTokenCredential() {
        return new OAuthTokenCredential(clientId, clientSecret, paypalSdkConfig());
    }

    @Bean
    public APIContext apiContext() throws PayPalRESTException {
        APIContext context = new APIContext(authTokenCredential().getAccessToken());
        context.setConfigurationMap(paypalSdkConfig());
        return context;
    }
}
