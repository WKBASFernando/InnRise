package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.AuthDTO;
import com.ijse.innrisebackend.dto.RegisterDTO;
import com.ijse.innrisebackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "User Registered Successfully",
                        authService.register(registerDTO)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "OK",
                        authService.authenticate(authDTO)
                )
        );
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse> googleLogin(@RequestBody Map<String, String> payload) {
        String googleToken = payload.get("token"); // token from frontend
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Google login successful",
                        authService.authenticateGoogle(googleToken)
                )
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Token refreshed successfully",
                        authService.refreshToken(refreshToken)
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        authService.logout(refreshToken);
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "Logged out successfully",
                        null
                )
        );
    }
}

