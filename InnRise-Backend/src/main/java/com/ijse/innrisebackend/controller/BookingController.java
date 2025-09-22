package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.entity.Booking;
import com.ijse.innrisebackend.entity.Hotel;
import com.ijse.innrisebackend.entity.Room;
import com.ijse.innrisebackend.repository.BookingRepository;
import com.ijse.innrisebackend.repository.HotelRepository;
import com.ijse.innrisebackend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/innrise/booking")
@RequiredArgsConstructor
@CrossOrigin
public class BookingController {
    
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createBooking(@RequestBody BookingRequest request) {
        try {
            // Backend business logic: Validate hotel exists
            Optional<Hotel> hotelOpt = hotelRepository.findById(request.getHotelId());
            if (hotelOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Hotel not found", null)
                );
            }
            
            Hotel hotel = hotelOpt.get();
            
            // Backend business logic: Validate room exists and belongs to hotel
            Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
            if (roomOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Room not found", null)
                );
            }
            
            Room room = roomOpt.get();
            
            // Backend business logic: Validate room belongs to the selected hotel
            if (!room.getHotel().getHotelId().equals(hotel.getHotelId())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Selected room does not belong to the specified hotel", null)
                );
            }
            
            // Backend business logic: Parse and validate dates
            LocalDate checkInDate = LocalDate.parse(request.getCheckIn(), DateTimeFormatter.ISO_LOCAL_DATE);
            LocalDate checkOutDate = LocalDate.parse(request.getCheckOut(), DateTimeFormatter.ISO_LOCAL_DATE);
            
            // Backend business logic: Validate dates
            if (checkInDate.isBefore(LocalDate.now())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Check-in date cannot be in the past", null)
                );
            }
            
            if (checkOutDate.isBefore(checkInDate) || checkOutDate.isEqual(checkInDate)) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Check-out date must be after check-in date", null)
                );
            }
            
            // Backend business logic: Calculate total amount using room-specific pricing
            long nights = java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
            double pricePerNight = room.getPrice() != null ? room.getPrice() : 0.0;
            double totalAmount = pricePerNight * nights * request.getRooms();
            
            // Backend business logic: Create booking entity with room information
            Booking booking = new Booking();
            booking.setHotel(hotel);
            booking.setRoom(room); // Backend handles room selection
            booking.setCheckInDate(checkInDate);
            booking.setCheckOutDate(checkOutDate);
            booking.setNumberOfGuests(request.getGuests());
            booking.setNumberOfRooms(request.getRooms());
            booking.setSpecialRequests(request.getSpecialRequests());
            booking.setTotalAmount(totalAmount); // Backend calculated amount using room price
            booking.setStatus("CONFIRMED");
            
            // Save booking
            Booking savedBooking = bookingRepository.save(booking);
            
            log.info("Booking created successfully with ID: {}", savedBooking.getBookingId());
            
            return ResponseEntity.ok(
                new ApiResponse(
                    200,
                    "Booking created successfully",
                    new BookingResponse(
                        savedBooking.getBookingId(),
                        hotel.getName(),
                        room.getType(), // Backend provides room type
                        savedBooking.getCheckInDate().toString(),
                        savedBooking.getCheckOutDate().toString(),
                        savedBooking.getTotalAmount()
                    )
                )
            );
            
        } catch (Exception e) {
            log.error("Error creating booking: ", e);
            return ResponseEntity.status(500).body(
                new ApiResponse(500, "Error creating booking", e.getMessage())
            );
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserBookings(@PathVariable Long userId) {
        try {
            // In a real application, you'd validate that the user can only see their own bookings
            List<Booking> bookings = bookingRepository.findByUserId(userId);
            
            return ResponseEntity.ok(
                new ApiResponse(200, "Bookings retrieved successfully", bookings)
            );
            
        } catch (Exception e) {
            log.error("Error retrieving bookings: ", e);
            return ResponseEntity.status(500).body(
                new ApiResponse(500, "Error retrieving bookings", e.getMessage())
            );
        }
    }
    
    // Inner classes for request/response DTOs
    public static class BookingRequest {
        private Long hotelId;
        private Long roomId; // Backend handles room selection
        private String checkIn;
        private String checkOut;
        private Integer guests;
        private Integer rooms;
        private String specialRequests;
        // totalAmount removed - backend will calculate it
        
        // Getters and setters
        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
        
        public Long getRoomId() { return roomId; }
        public void setRoomId(Long roomId) { this.roomId = roomId; }
        
        public String getCheckIn() { return checkIn; }
        public void setCheckIn(String checkIn) { this.checkIn = checkIn; }
        
        public String getCheckOut() { return checkOut; }
        public void setCheckOut(String checkOut) { this.checkOut = checkOut; }
        
        public Integer getGuests() { return guests; }
        public void setGuests(Integer guests) { this.guests = guests; }
        
        public Integer getRooms() { return rooms; }
        public void setRooms(Integer rooms) { this.rooms = rooms; }
        
        public String getSpecialRequests() { return specialRequests; }
        public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }
    }
    
    public static class BookingResponse {
        private Long bookingId;
        private String hotelName;
        private String roomType; // Backend provides room type
        private String checkIn;
        private String checkOut;
        private Double totalAmount;
        
        public BookingResponse(Long bookingId, String hotelName, String roomType, String checkIn, String checkOut, Double totalAmount) {
            this.bookingId = bookingId;
            this.hotelName = hotelName;
            this.roomType = roomType;
            this.checkIn = checkIn;
            this.checkOut = checkOut;
            this.totalAmount = totalAmount;
        }
        
        // Getters
        public Long getBookingId() { return bookingId; }
        public String getHotelName() { return hotelName; }
        public String getRoomType() { return roomType; }
        public String getCheckIn() { return checkIn; }
        public String getCheckOut() { return checkOut; }
        public Double getTotalAmount() { return totalAmount; }
    }
}
