package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.entity.Booking;
import com.ijse.innrisebackend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingCleanupService {
    
    private final BookingRepository bookingRepository;
    
    /**
     * Clean up unpaid bookings that are older than 30 minutes
     * This runs every 10 minutes
     */
    @Scheduled(fixedRate = 600000) // 10 minutes in milliseconds
    @Transactional
    public void cleanupUnpaidBookings() {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minus(30, ChronoUnit.MINUTES);
            
            // Find all PENDING bookings older than 30 minutes
            List<Booking> unpaidBookings = bookingRepository.findByStatusAndCreatedAtBefore("PENDING", cutoffTime);
            
            if (!unpaidBookings.isEmpty()) {
                log.info("Found {} unpaid bookings to cleanup", unpaidBookings.size());
                
                // Delete unpaid bookings
                bookingRepository.deleteAll(unpaidBookings);
                
                log.info("Cleaned up {} unpaid bookings", unpaidBookings.size());
            }
            
        } catch (Exception e) {
            log.error("Error during booking cleanup", e);
        }
    }
    
    /**
     * Manually cleanup unpaid bookings (can be called from admin panel)
     */
    @Transactional
    public int manualCleanupUnpaidBookings() {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minus(30, ChronoUnit.MINUTES);
            
            List<Booking> unpaidBookings = bookingRepository.findByStatusAndCreatedAtBefore("PENDING", cutoffTime);
            
            if (!unpaidBookings.isEmpty()) {
                bookingRepository.deleteAll(unpaidBookings);
                log.info("Manually cleaned up {} unpaid bookings", unpaidBookings.size());
            }
            
            return unpaidBookings.size();
            
        } catch (Exception e) {
            log.error("Error during manual booking cleanup", e);
            return 0;
        }
    }
}
