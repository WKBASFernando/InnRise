package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.entity.*;
import com.ijse.innrisebackend.enums.Role;
import com.ijse.innrisebackend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/innrise/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {
    
    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DiscountRepository discountRepository;
    private final RoomRepository roomRepository;
    
    // ==================== DASHBOARD STATS ====================
    
    @GetMapping("/hotels/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTotalHotels() {
        try {
            long count = hotelRepository.count();
            return ResponseEntity.ok(new ApiResponse(200, "Total hotels retrieved", count));
        } catch (Exception e) {
            log.error("Error getting total hotels: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving total hotels", e.getMessage()));
        }
    }
    
    @GetMapping("/bookings/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTotalBookings() {
        try {
            long count = bookingRepository.count();
            return ResponseEntity.ok(new ApiResponse(200, "Total bookings retrieved", count));
        } catch (Exception e) {
            log.error("Error getting total bookings: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving total bookings", e.getMessage()));
        }
    }
    
    @GetMapping("/users/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTotalUsers() {
        try {
            long count = userRepository.count();
            return ResponseEntity.ok(new ApiResponse(200, "Total users retrieved", count));
        } catch (Exception e) {
            log.error("Error getting total users: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving total users", e.getMessage()));
        }
    }
    
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getTotalRevenue() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            double totalRevenue = bookings.stream()
                    .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                    .mapToDouble(booking -> booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0)
                    .sum();
            return ResponseEntity.ok(new ApiResponse(200, "Total revenue retrieved", totalRevenue));
        } catch (Exception e) {
            log.error("Error getting total revenue: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving total revenue", e.getMessage()));
        }
    }
    
    // ==================== HOTELS MANAGEMENT ====================
    
    @GetMapping("/hotels")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllHotels() {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(200, "Hotels retrieved successfully", hotels));
        } catch (Exception e) {
            log.error("Error getting hotels: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving hotels", e.getMessage()));
        }
    }
    
    @PostMapping("/hotels")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addHotel(@RequestBody Hotel hotel) {
        try {
            // Validate required fields
            if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Hotel name is required", null));
            }
            
            Hotel savedHotel = hotelRepository.save(hotel);
            log.info("Hotel added successfully with ID: {}", savedHotel.getHotelId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Hotel added successfully", savedHotel));
        } catch (Exception e) {
            log.error("Error adding hotel: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error adding hotel", e.getMessage()));
        }
    }
    
    @PutMapping("/hotels/{hotelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateHotel(@PathVariable Long hotelId, @RequestBody Hotel hotel) {
        try {
            Optional<Hotel> existingHotel = hotelRepository.findById(hotelId);
            if (existingHotel.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Hotel not found", null));
            }
            
            Hotel hotelToUpdate = existingHotel.get();
            hotelToUpdate.setName(hotel.getName());
            hotelToUpdate.setLocation(hotel.getLocation());
            hotelToUpdate.setAddress(hotel.getAddress());
            hotelToUpdate.setContact_number(hotel.getContact_number());
            hotelToUpdate.setEmail(hotel.getEmail());
            hotelToUpdate.setDescription(hotel.getDescription());
            hotelToUpdate.setStar_rating(hotel.getStar_rating());
            hotelToUpdate.setPrice(hotel.getPrice());
            
            Hotel updatedHotel = hotelRepository.save(hotelToUpdate);
            log.info("Hotel updated successfully with ID: {}", updatedHotel.getHotelId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Hotel updated successfully", updatedHotel));
        } catch (Exception e) {
            log.error("Error updating hotel: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error updating hotel", e.getMessage()));
        }
    }
    
    @DeleteMapping("/hotels/{hotelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteHotel(@PathVariable Long hotelId) {
        try {
            Optional<Hotel> hotel = hotelRepository.findById(hotelId);
            if (hotel.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Hotel not found", null));
            }
            
            hotelRepository.deleteById(hotelId);
            log.info("Hotel deleted successfully with ID: {}", hotelId);
            
            return ResponseEntity.ok(new ApiResponse(200, "Hotel deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting hotel: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error deleting hotel", e.getMessage()));
        }
    }
    
    // ==================== DISCOUNTS MANAGEMENT ====================
    
    @GetMapping("/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllDiscounts() {
        try {
            List<Discount> discounts = discountRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(200, "Discounts retrieved successfully", discounts));
        } catch (Exception e) {
            log.error("Error getting discounts: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving discounts", e.getMessage()));
        }
    }
    
    @PostMapping("/discounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addDiscount(@RequestBody Discount discount) {
        try {
            // Validate required fields
            if (discount.getName() == null || discount.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Discount name is required", null));
            }
            
            Discount savedDiscount = discountRepository.save(discount);
            log.info("Discount added successfully with ID: {}", savedDiscount.getDiscountId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Discount added successfully", savedDiscount));
        } catch (Exception e) {
            log.error("Error adding discount: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error adding discount", e.getMessage()));
        }
    }
    
    @PutMapping("/discounts/{discountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateDiscount(@PathVariable Long discountId, @RequestBody Discount discount) {
        try {
            Optional<Discount> existingDiscount = discountRepository.findById(discountId);
            if (existingDiscount.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Discount not found", null));
            }
            
            Discount discountToUpdate = existingDiscount.get();
            discountToUpdate.setName(discount.getName());
            discountToUpdate.setPercentage(discount.getPercentage());
            discountToUpdate.setValidFrom(discount.getValidFrom());
            discountToUpdate.setValidTo(discount.getValidTo());
            discountToUpdate.setDescription(discount.getDescription());
            
            Discount updatedDiscount = discountRepository.save(discountToUpdate);
            log.info("Discount updated successfully with ID: {}", updatedDiscount.getDiscountId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Discount updated successfully", updatedDiscount));
        } catch (Exception e) {
            log.error("Error updating discount: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error updating discount", e.getMessage()));
        }
    }
    
    @DeleteMapping("/discounts/{discountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteDiscount(@PathVariable Long discountId) {
        try {
            Optional<Discount> discount = discountRepository.findById(discountId);
            if (discount.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Discount not found", null));
            }
            
            discountRepository.deleteById(discountId);
            log.info("Discount deleted successfully with ID: {}", discountId);
            
            return ResponseEntity.ok(new ApiResponse(200, "Discount deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting discount: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error deleting discount", e.getMessage()));
        }
    }
    
    // ==================== USERS MANAGEMENT ====================
    
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(200, "Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error getting users: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving users", e.getMessage()));
        }
    }
    
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addUser(@RequestBody AddUserRequest request) {
        try {
            // Validate required fields
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Email is required", null));
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Email already exists", null));
            }
            
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // Note: Should be encoded in production
            user.setRole(request.getRole());
            
            // Set hotel if role is HOTEL_ADMIN
            if (request.getRole() == Role.HOTEL_ADMIN && request.getHotelId() != null) {
                Optional<Hotel> hotel = hotelRepository.findById(request.getHotelId());
                if (hotel.isPresent()) {
                    user.setHotel(hotel.get());
                }
            }
            
            User savedUser = userRepository.save(user);
            log.info("User added successfully with ID: {}", savedUser.getId());
            
            return ResponseEntity.ok(new ApiResponse(200, "User added successfully", savedUser));
        } catch (Exception e) {
            log.error("Error adding user: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error adding user", e.getMessage()));
        }
    }
    
    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long userId, @RequestBody User user) {
        try {
            Optional<User> existingUser = userRepository.findById(userId);
            if (existingUser.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "User not found", null));
            }
            
            User userToUpdate = existingUser.get();
            userToUpdate.setFirstName(user.getFirstName());
            userToUpdate.setLastName(user.getLastName());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setRole(user.getRole());
            userToUpdate.setHotel(user.getHotel());
            
            User updatedUser = userRepository.save(userToUpdate);
            log.info("User updated successfully with ID: {}", updatedUser.getId());
            
            return ResponseEntity.ok(new ApiResponse(200, "User updated successfully", updatedUser));
        } catch (Exception e) {
            log.error("Error updating user: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error updating user", e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "User not found", null));
            }
            
            userRepository.deleteById(userId);
            log.info("User deleted successfully with ID: {}", userId);
            
            return ResponseEntity.ok(new ApiResponse(200, "User deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting user: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error deleting user", e.getMessage()));
        }
    }
    
    // ==================== BOOKINGS MANAGEMENT ====================
    
    @GetMapping("/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(new ApiResponse(200, "Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error getting bookings: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving bookings", e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{bookingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateBookingStatus(@PathVariable Long bookingId, @RequestBody UpdateBookingStatusRequest request) {
        try {
            Optional<Booking> booking = bookingRepository.findById(bookingId);
            if (booking.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Booking not found", null));
            }
            
            Booking bookingToUpdate = booking.get();
            bookingToUpdate.setStatus(request.getStatus());
            
            Booking updatedBooking = bookingRepository.save(bookingToUpdate);
            log.info("Booking status updated successfully with ID: {}", updatedBooking.getBookingId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Booking status updated successfully", updatedBooking));
        } catch (Exception e) {
            log.error("Error updating booking status: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error updating booking status", e.getMessage()));
        }
    }
    
    // ==================== HOTEL ADMIN ENDPOINTS ====================
    
    @GetMapping("/bookings/hotel/{hotelId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ApiResponse> getBookingsByHotel(@PathVariable Long hotelId) {
        try {
            List<Booking> bookings = bookingRepository.findByHotelHotelId(hotelId);
            return ResponseEntity.ok(new ApiResponse(200, "Hotel bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error getting hotel bookings: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error retrieving hotel bookings", e.getMessage()));
        }
    }
    
    // ==================== ROOM MANAGEMENT ====================
    
    @PostMapping("/rooms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ApiResponse> addRoom(@RequestBody AddRoomRequest request) {
        try {
            // Validate hotel exists
            Optional<Hotel> hotel = hotelRepository.findById(request.getHotelId());
            if (hotel.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Hotel not found", null));
            }
            
            Room room = new Room();
            room.setType(request.getType());
            room.setPrice(request.getPrice());
            room.setHotel(hotel.get());
            
            Room savedRoom = roomRepository.save(room);
            log.info("Room added successfully with ID: {}", savedRoom.getRoomId());
            
            return ResponseEntity.ok(new ApiResponse(200, "Room added successfully", savedRoom));
        } catch (Exception e) {
            log.error("Error adding room: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error adding room", e.getMessage()));
        }
    }
    
    @DeleteMapping("/rooms/{roomId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ApiResponse> deleteRoom(@PathVariable Long roomId) {
        try {
            Optional<Room> room = roomRepository.findById(roomId);
            if (room.isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(400, "Room not found", null));
            }
            
            roomRepository.deleteById(roomId);
            log.info("Room deleted successfully with ID: {}", roomId);
            
            return ResponseEntity.ok(new ApiResponse(200, "Room deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting room: ", e);
            return ResponseEntity.status(500).body(new ApiResponse(500, "Error deleting room", e.getMessage()));
        }
    }
    
    // ==================== REQUEST DTOs ====================
    
    public static class AddUserRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private Role role;
        private Long hotelId;
        
        // Getters and setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        
        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
    }
    
    public static class UpdateBookingStatusRequest {
        private String status;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
    
    public static class AddRoomRequest {
        private String type;
        private Double price;
        private Long hotelId;
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
        
        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
    }
}
