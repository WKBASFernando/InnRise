package com.ijse.innrisebackend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.ijse.innrisebackend.dto.AuthDTO;
import com.ijse.innrisebackend.dto.AuthResponseDTO;
import com.ijse.innrisebackend.dto.RegisterDTO;
import com.ijse.innrisebackend.entity.User;
import com.ijse.innrisebackend.enums.Role;
import com.ijse.innrisebackend.repository.AuthRepository;
import com.ijse.innrisebackend.service.RefreshTokenService;
import com.ijse.innrisebackend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    // -------------------- REGISTER --------------------
    public User register(RegisterDTO registerDTO) {
        if (authRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .email(registerDTO.getEmail())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole().toUpperCase()))
                .build();

        return authRepository.save(user);
    }

    // -------------------- LOGIN --------------------
    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        Optional<User> userOpt = authRepository.findByEmail(authDTO.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User user = userOpt.get();

        // Check if user has a password (not a Google-only user)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("This account is linked to Google Sign-In. Please use Google Sign-In to access your account.");
        }

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT access token using JwtUtil with role
        String accessToken = jwtUtil.generateTokenWithRole(user.getEmail(), user.getRole().name());

        // Generate refresh token
        var refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(15 * 60L) // 15 minutes in seconds
                .build();
    }

    public AuthResponseDTO authenticateGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance() //  use GsonFactory instead of Jackson
            )
                    .setAudience(Collections.singletonList("427810863490-vvr3a2jimu7ki8du7up4ofatfteqrit0.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");

                User user = authRepository.findByEmail(email)
                        .orElseGet(() -> {
                            User newUser = User.builder()
                                    .firstName(firstName)
                                    .lastName(lastName)
                                    .email(email)
                                    .password("") // Google login, no password
                                    .role(Role.USER)
                                    .build();
                            return authRepository.save(newUser);
                        });
                
                // If user exists, preserve their existing role and password
                // This allows both manual login and Google Sign-In to work
                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    // User exists with a password (manual user), preserve their role and password
                    // No need to save - just use the existing user
                }

                // Generate JWT access token using JwtUtil with role
                String accessToken = jwtUtil.generateTokenWithRole(user.getEmail(), user.getRole().name());

                // Generate refresh token
                var refreshToken = refreshTokenService.createRefreshToken(user);

                return AuthResponseDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken.getToken())
                        .tokenType("Bearer")
                        .expiresIn(15 * 60L) // 15 minutes in seconds
                        .build();
            } else {
                throw new RuntimeException("Invalid Google ID token");
            }

        } catch (Exception e) {
            e.printStackTrace(); // 🔍 see actual error
            throw new RuntimeException("Google authentication failed", e);
        }
    }

    // -------------------- REFRESH TOKEN --------------------
    public AuthResponseDTO refreshToken(String refreshToken) {
        var token = refreshTokenService.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (token.isRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        var verifiedToken = refreshTokenService.verifyExpiration(token);
        var user = verifiedToken.getUser();

        // Generate new access token using JwtUtil with role
        String newAccessToken = jwtUtil.generateTokenWithRole(user.getEmail(), user.getRole().name());

        return AuthResponseDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Keep the same refresh token
                .tokenType("Bearer")
                .expiresIn(15 * 60L) // 15 minutes in seconds
                .build();
    }

    // -------------------- LOGOUT --------------------
    public void logout(String refreshToken) {
        refreshTokenService.revokeToken(refreshToken);
    }
}
