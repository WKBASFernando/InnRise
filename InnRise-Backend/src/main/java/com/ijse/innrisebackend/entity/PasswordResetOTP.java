package com.ijse.innrisebackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "password_reset_otp")
public class PasswordResetOTP {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String otp;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "verified", nullable = false)
    private boolean verified = false;
    
    @Column(name = "attempts", nullable = false)
    private int attempts = 0;
    
    // Constructor to set expiration time (10 minutes from creation)
    public PasswordResetOTP() {
        this.expiresAt = LocalDateTime.now().plusMinutes(10);
    }
    
    // Check if OTP is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
    
    // Check if OTP is valid (not expired and not verified)
    public boolean isValid() {
        return !isExpired() && !verified && attempts < 3;
    }
    
    // Increment attempt count
    public void incrementAttempts() {
        this.attempts++;
    }
    
    // Mark as verified
    public void markAsVerified() {
        this.verified = true;
    }
}
