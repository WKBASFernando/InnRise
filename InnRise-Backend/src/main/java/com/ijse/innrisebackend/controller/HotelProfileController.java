package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.HotelProfileDTO;
import com.ijse.innrisebackend.service.HotelProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/innrise/hotel-profile")
@RequiredArgsConstructor
@CrossOrigin
public class HotelProfileController {

    private final HotelProfileService hotelProfileService;

    @GetMapping("/{hotelId}")
    public ResponseEntity<ApiResponse> getHotelProfile(@PathVariable Long hotelId) {
        try {
            log.info("Fetching hotel profile for ID: {}", hotelId);
            
            HotelProfileDTO profile = hotelProfileService.getHotelProfile(hotelId);
            
            return ResponseEntity.ok(
                new ApiResponse(
                    200,
                    "Hotel profile retrieved successfully",
                    profile
                )
            );
            
        } catch (Exception e) {
            log.error("Error fetching hotel profile for ID {}: {}", hotelId, e.getMessage());
            
            return ResponseEntity.status(500).body(
                new ApiResponse(
                    500,
                    "Error retrieving hotel profile",
                    e.getMessage()
                )
            );
        }
    }

    @GetMapping("/{hotelId}/rooms")
    public ResponseEntity<ApiResponse> getHotelRooms(@PathVariable Long hotelId) {
        try {
            log.info("Fetching rooms for hotel ID: {}", hotelId);
            
            HotelProfileDTO profile = hotelProfileService.getHotelProfile(hotelId);
            
            return ResponseEntity.ok(
                new ApiResponse(
                    200,
                    "Hotel rooms retrieved successfully",
                    profile.getRooms()
                )
            );
            
        } catch (Exception e) {
            log.error("Error fetching rooms for hotel ID {}: {}", hotelId, e.getMessage());
            
            return ResponseEntity.status(500).body(
                new ApiResponse(
                    500,
                    "Error retrieving hotel rooms",
                    e.getMessage()
                )
            );
        }
    }

    @GetMapping("/{hotelId}/packages")
    public ResponseEntity<ApiResponse> getHotelPackages(@PathVariable Long hotelId) {
        try {
            log.info("Fetching packages for hotel ID: {}", hotelId);
            
            HotelProfileDTO profile = hotelProfileService.getHotelProfile(hotelId);
            
            return ResponseEntity.ok(
                new ApiResponse(
                    200,
                    "Hotel packages retrieved successfully",
                    profile.getPackages()
                )
            );
            
        } catch (Exception e) {
            log.error("Error fetching packages for hotel ID {}: {}", hotelId, e.getMessage());
            
            return ResponseEntity.status(500).body(
                new ApiResponse(
                    500,
                    "Error retrieving hotel packages",
                    e.getMessage()
                )
            );
        }
    }

    @GetMapping("/{hotelId}/photos")
    public ResponseEntity<ApiResponse> getHotelPhotos(@PathVariable Long hotelId) {
        try {
            log.info("Fetching photos for hotel ID: {}", hotelId);
            
            HotelProfileDTO profile = hotelProfileService.getHotelProfile(hotelId);
            
            return ResponseEntity.ok(
                new ApiResponse(
                    200,
                    "Hotel photos retrieved successfully",
                    profile.getPhotos()
                )
            );
            
        } catch (Exception e) {
            log.error("Error fetching photos for hotel ID {}: {}", hotelId, e.getMessage());
            
            return ResponseEntity.status(500).body(
                new ApiResponse(
                    500,
                    "Error retrieving hotel photos",
                    e.getMessage()
                )
            );
        }
    }
}
