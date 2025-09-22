package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/test")
@CrossOrigin
public class TestController {
    
    @GetMapping("/date")
    public ResponseEntity<ApiResponse> testDate() {
        LocalDate now = LocalDate.now();
        LocalDate testDate = LocalDate.parse("2025-02-15", DateTimeFormatter.ISO_LOCAL_DATE);
        
        return ResponseEntity.ok(new ApiResponse(200, "Date test", 
            "Current date: " + now + 
            ", Test date: " + testDate + 
            ", Is test date in past: " + testDate.isBefore(now)));
    }
    
    @PostMapping("/booking-test")
    public ResponseEntity<ApiResponse> testBooking(@RequestBody String requestBody) {
        return ResponseEntity.ok(new ApiResponse(200, "Request received", requestBody));
    }
}