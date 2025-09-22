package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.ForgotPasswordRequest;
import com.ijse.innrisebackend.dto.VerifyOTPRequest;
import com.ijse.innrisebackend.dto.ResetPasswordWithOTPRequest;
import com.ijse.innrisebackend.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/innrise/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PasswordResetController {
    
    private final PasswordResetService passwordResetService;
    
    
    // ===================== OTP-BASED PASSWORD RESET ENDPOINTS =====================
    
    @PostMapping("/forgot-password-otp")
    public ResponseEntity<ApiResponse> forgotPasswordWithOTP(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            log.info("Password reset OTP requested for email: {}", request.getEmail());
            
            boolean success = passwordResetService.initiatePasswordResetWithOTP(request);
            
            if (success) {
                return ResponseEntity.ok(new ApiResponse(
                    200, 
                    "If an account with that email exists, a 6-digit code has been sent to your email.",
                    null
                ));
            } else {
                return ResponseEntity.status(500).body(new ApiResponse(
                    500, 
                    "Failed to process password reset request. Please try again later.",
                    null
                ));
            }
            
        } catch (Exception e) {
            log.error("Error processing forgot password OTP request for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500, 
                "An error occurred while processing your request. Please try again later.",
                null
            ));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        try {
            log.info("OTP verification attempted for email: {}", request.getEmail());
            
            boolean success = passwordResetService.verifyOTP(request);
            
            if (success) {
                return ResponseEntity.ok(new ApiResponse(
                    200, 
                    "OTP verified successfully. You can now reset your password.",
                    null
                ));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(
                    400, 
                    "Invalid or expired OTP. Please check your email and try again.",
                    null
                ));
            }
            
        } catch (Exception e) {
            log.error("Error verifying OTP for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500, 
                "An error occurred while verifying the OTP. Please try again later.",
                null
            ));
        }
    }
    
    @PostMapping("/reset-password-otp")
    public ResponseEntity<ApiResponse> resetPasswordWithOTP(@Valid @RequestBody ResetPasswordWithOTPRequest request) {
        try {
            log.info("Password reset with OTP attempted for email: {}", request.getEmail());
            
            boolean success = passwordResetService.resetPasswordWithOTP(request);
            
            if (success) {
                return ResponseEntity.ok(new ApiResponse(
                    200, 
                    "Password has been successfully reset. You can now log in with your new password.",
                    null
                ));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(
                    400, 
                    "Invalid OTP or the code has expired. Please request a new password reset.",
                    null
                ));
            }
            
        } catch (Exception e) {
            log.error("Error resetting password with OTP for email: {}", request.getEmail(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500, 
                "An error occurred while resetting your password. Please try again later.",
                null
            ));
        }
    }
}
