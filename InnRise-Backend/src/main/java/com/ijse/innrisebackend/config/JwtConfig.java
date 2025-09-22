package com.ijse.innrisebackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private long expiration = 900000; // 15 minutes in milliseconds
    private String secretKey = "ghfghjyhgfcvhtfghf5rtytrdrtyrewtrhyhrttgrfcd546tyuhvvgftrt453457yutgfcgrgfdt5ertghgffw43465tuyfgvcdxe6etwrj78867652bsdbcjszbkjcbhsbcvhbzchjbdhjcvbzhjbcdhsckjdbchkjdbsjcnkjldnscsdvcdfnvcjdnbjcbdhkdbcjlzdbckgshbcmxbvkjbdkcnds.cnx";
    
    public long getExpiration() {
        return expiration;
    }
    
    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
    
    public String getSecretKey() {
        return secretKey;
    }
    
    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }
}
