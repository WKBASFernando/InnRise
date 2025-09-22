package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.PaymentRequest;
import com.ijse.innrisebackend.dto.PaymentResponse;
import com.ijse.innrisebackend.entity.Booking;
import com.ijse.innrisebackend.repository.BookingRepository;
import com.ijse.innrisebackend.repository.PaymentRepository;
import com.ijse.innrisebackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/innrise/payment")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class PaymentController {
    
    private final PaymentService paymentService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    
    @PostMapping("/process")
    public ResponseEntity<ApiResponse> processPayment(@RequestBody PaymentRequest request) {
        try {
            log.info("Processing payment for booking ID: {}", request.getBookingId());
            
            // Validate booking exists
            Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Booking not found", null)
                );
            }
            
            Booking booking = bookingOpt.get();
            
            // Check if booking already has a payment
            if (paymentRepository.existsByBooking_BookingId(request.getBookingId())) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Payment already processed for this booking", null)
                );
            }
            
            // Validate payment amount matches booking total
            if (Math.abs(request.getAmount() - booking.getTotalAmount()) > 0.01) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Payment amount does not match booking total", null)
                );
            }
            
            // Process payment
            PaymentResponse paymentResponse = paymentService.processPayment(request, booking);
            
            if (paymentResponse.isSuccess()) {
                // Update booking status to CONFIRMED
                booking.setStatus("CONFIRMED");
                bookingRepository.save(booking);
                
                log.info("Payment processed successfully for booking ID: {}", request.getBookingId());
                return ResponseEntity.ok(new ApiResponse(200, "Payment processed successfully", paymentResponse));
            } else {
                log.error("Payment processing failed for booking ID: {}", request.getBookingId());
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Payment processing failed: " + paymentResponse.getMessage(), null)
                );
            }
            
        } catch (Exception e) {
            log.error("Error processing payment for booking ID: {}", request.getBookingId(), e);
            return ResponseEntity.status(500).body(
                new ApiResponse(500, "Internal server error during payment processing", null)
            );
        }
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Booking not found", null)
                );
            }
            
            Booking booking = bookingOpt.get();
            if (booking.getPayment() == null) {
                return ResponseEntity.ok(new ApiResponse(200, "No payment found for this booking", null));
            }
            
            PaymentResponse response = PaymentResponse.builder()
                .paymentId(booking.getPayment().getPaymentId())
                .bookingId(bookingId)
                .amount(booking.getPayment().getAmount())
                .method(booking.getPayment().getMethod().toString())
                .status("COMPLETED")
                .success(true)
                .message("Payment found")
                .build();
            
            return ResponseEntity.ok(new ApiResponse(200, "Payment retrieved successfully", response));
            
        } catch (Exception e) {
            log.error("Error retrieving payment for booking ID: {}", bookingId, e);
            return ResponseEntity.status(500).body(
                new ApiResponse(500, "Internal server error", null)
            );
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse> validatePayment(@RequestBody PaymentRequest request) {
        try {
            // Basic validation
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Invalid payment amount", null)
                );
            }
            
            if (request.getMethod() == null) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Payment method is required", null)
                );
            }
            
            // Validate booking exists and amount matches
            Optional<Booking> bookingOpt = bookingRepository.findById(request.getBookingId());
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Booking not found", null)
                );
            }
            
            Booking booking = bookingOpt.get();
            if (Math.abs(request.getAmount() - booking.getTotalAmount()) > 0.01) {
                return ResponseEntity.badRequest().body(
                    new ApiResponse(400, "Payment amount does not match booking total", null)
                );
            }
            
            return ResponseEntity.ok(new ApiResponse(200, "Payment validation successful", null));
            
        } catch (Exception e) {
            log.error("Error validating payment", e);
            return ResponseEntity.status(500).body(
                new ApiResponse(500, "Internal server error during validation", null)
            );
        }
    }
}
