package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByHotelHotelId(Long hotelId);
    List<Booking> findByStatus(String status);
    List<Booking> findByStatusAndCreatedAtBefore(String status, LocalDateTime createdAt);
}
