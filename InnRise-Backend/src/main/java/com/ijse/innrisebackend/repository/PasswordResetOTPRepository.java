package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.PasswordResetOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetOTPRepository extends JpaRepository<PasswordResetOTP, Long> {
    
    // Find OTP by email
    Optional<PasswordResetOTP> findByEmail(String email);
    
    // Find valid OTP by email
    @Query("SELECT o FROM PasswordResetOTP o WHERE o.email = :email AND o.verified = false AND o.expiresAt > :now AND o.attempts < 3")
    Optional<PasswordResetOTP> findValidOTPByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
    
    // Mark OTP as verified
    @Modifying
    @Query("UPDATE PasswordResetOTP o SET o.verified = true WHERE o.email = :email")
    void markOTPAsVerified(@Param("email") String email);
    
    // Delete expired OTPs
    @Modifying
    @Query("DELETE FROM PasswordResetOTP o WHERE o.expiresAt < :now")
    int deleteExpiredOTPs(@Param("now") LocalDateTime now);
    
    // Delete all OTPs for an email
    @Modifying
    @Query("DELETE FROM PasswordResetOTP o WHERE o.email = :email")
    void deleteAllOTPsForEmail(@Param("email") String email);
}
