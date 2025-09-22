package com.ijse.innrisebackend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import com.ijse.innrisebackend.util.JwtAuthFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/test/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/innrise/hotel/**").permitAll()
                        .requestMatchers("/api/innrise/hotel-profile/**").permitAll()
                        .requestMatchers("/api/innrise/booking/**").permitAll()
                        .requestMatchers("/api/innrise/payment/**").permitAll()
                .requestMatchers("/api/innrise/contact/submit").permitAll()
                .requestMatchers("/api/innrise/contact/**").hasRole("ADMIN")
                .requestMatchers("/api/innrise/auth/forgot-password-otp").permitAll()
                .requestMatchers("/api/innrise/auth/verify-otp").permitAll()
                .requestMatchers("/api/innrise/auth/reset-password-otp").permitAll()
                        .requestMatchers("/api/innrise/admin/**").hasAnyRole("ADMIN", "HOTEL_ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}
