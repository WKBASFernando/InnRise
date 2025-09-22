package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.dto.ForgotPasswordRequest;
import com.ijse.innrisebackend.dto.VerifyOTPRequest;
import com.ijse.innrisebackend.dto.ResetPasswordWithOTPRequest;
import com.ijse.innrisebackend.entity.PasswordResetOTP;
import com.ijse.innrisebackend.entity.User;
import com.ijse.innrisebackend.repository.PasswordResetOTPRepository;
import com.ijse.innrisebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {
    
    private final UserRepository userRepository;
    private final PasswordResetOTPRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    private static final SecureRandom secureRandom = new SecureRandom();
    
    
    // ===================== OTP-BASED PASSWORD RESET =====================
    
    @Transactional
    public boolean initiatePasswordResetWithOTP(ForgotPasswordRequest request) {
        try {
            // Find user by email
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("Password reset OTP requested for non-existent email: {}", request.getEmail());
                // Return true to prevent email enumeration attacks
                return true;
            }
            
            User user = userOpt.get();
            
            // Delete any existing OTPs for this email
            otpRepository.deleteAllOTPsForEmail(request.getEmail());
            
            // Generate 6-digit OTP
            String otp = generateOTP();
            
            // Create and save OTP
            PasswordResetOTP resetOTP = new PasswordResetOTP();
            resetOTP.setEmail(request.getEmail());
            resetOTP.setOtp(otp);
            resetOTP.setExpiresAt(LocalDateTime.now().plusMinutes(10));
            resetOTP.setVerified(false);
            resetOTP.setAttempts(0);
            
            otpRepository.save(resetOTP);
            
            // Send OTP email
            boolean emailSent = emailService.sendPasswordResetOTP(user, otp);
            
            log.info("Password reset OTP generated for user: {} (email sent: {})", user.getEmail(), emailSent);
            return true;
            
        } catch (Exception e) {
            log.error("Error initiating password reset with OTP for email: {}", request.getEmail(), e);
            return false;
        }
    }
    
    @Transactional
    public boolean verifyOTP(VerifyOTPRequest request) {
        try {
            // Find OTP
            Optional<PasswordResetOTP> otpOpt = otpRepository.findValidOTPByEmail(request.getEmail(), LocalDateTime.now());
            if (otpOpt.isEmpty()) {
                log.warn("Invalid or expired OTP for email: {}", request.getEmail());
                return false;
            }
            
            PasswordResetOTP otp = otpOpt.get();
            
            // Check if OTP matches
            if (!otp.getOtp().equals(request.getOtp())) {
                otp.incrementAttempts();
                otpRepository.save(otp);
                log.warn("Invalid OTP attempt for email: {} (attempts: {})", request.getEmail(), otp.getAttempts());
                return false;
            }
            
            // Mark OTP as verified
            otp.markAsVerified();
            otpRepository.save(otp);
            
            log.info("OTP verified successfully for email: {}", request.getEmail());
            return true;
            
        } catch (Exception e) {
            log.error("Error verifying OTP for email: {}", request.getEmail(), e);
            return false;
        }
    }
    
    @Transactional
    public boolean resetPasswordWithOTP(ResetPasswordWithOTPRequest request) {
        try {
            // Find verified OTP
            Optional<PasswordResetOTP> otpOpt = otpRepository.findByEmail(request.getEmail());
            if (otpOpt.isEmpty()) {
                log.warn("No OTP found for email: {}", request.getEmail());
                return false;
            }
            
            PasswordResetOTP otp = otpOpt.get();
            
            // Validate OTP
            if (!otp.isVerified() || otp.isExpired()) {
                log.warn("OTP not verified or expired for email: {}", request.getEmail());
                return false;
            }
            
            // Verify OTP matches
            if (!otp.getOtp().equals(request.getOtp())) {
                log.warn("OTP mismatch for email: {}", request.getEmail());
                return false;
            }
            
            // Find user and update password
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("User not found for email: {}", request.getEmail());
                return false;
            }
            
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            // Delete the used OTP
            otpRepository.delete(otp);
            
            log.info("Password successfully reset with OTP for user: {}", user.getEmail());
            return true;
            
        } catch (Exception e) {
            log.error("Error resetting password with OTP for email: {}", request.getEmail(), e);
            return false;
        }
    }
    
    private String generateOTP() {
        // Generate 6-digit OTP
        return String.format("%06d", secureRandom.nextInt(1000000));
    }
    
    // Cleanup expired OTPs (can be called periodically)
    @Transactional
    public void cleanupExpiredOTPs() {
        try {
            int deletedCount = otpRepository.deleteExpiredOTPs(LocalDateTime.now());
            log.info("Cleaned up {} expired password reset OTPs", deletedCount);
        } catch (Exception e) {
            log.error("Error cleaning up expired OTPs", e);
        }
    }
}
