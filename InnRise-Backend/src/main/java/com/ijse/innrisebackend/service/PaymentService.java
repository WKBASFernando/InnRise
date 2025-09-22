package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.dto.PaymentRequest;
import com.ijse.innrisebackend.dto.PaymentResponse;
import com.ijse.innrisebackend.entity.Booking;
import com.ijse.innrisebackend.entity.Payment;
import com.ijse.innrisebackend.enums.PaymentMethod;
import com.ijse.innrisebackend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request, Booking booking) {
        try {
            log.info("Processing payment for booking ID: {} with amount: {}", booking.getBookingId(), request.getAmount());
            
            // Simulate payment processing (in real implementation, this would integrate with payment gateway)
            boolean paymentSuccessful = simulatePaymentGateway(request);
            
            if (paymentSuccessful) {
                // Create payment record
                Payment payment = new Payment();
                payment.setAmount(request.getAmount());
                payment.setMethod(PaymentMethod.valueOf(request.getMethod()));
                payment.setBooking(booking);
                
                // Save payment
                Payment savedPayment = paymentRepository.save(payment);
                
                // Update booking to reference the payment
                booking.setPayment(savedPayment);
                
                log.info("Payment processed successfully with ID: {}", savedPayment.getPaymentId());
                
                return PaymentResponse.builder()
                    .paymentId(savedPayment.getPaymentId())
                    .bookingId(booking.getBookingId())
                    .amount(request.getAmount())
                    .method(request.getMethod())
                    .status("COMPLETED")
                    .success(true)
                    .message("Payment processed successfully")
                    .transactionId(generateTransactionId())
                    .processedAt(LocalDateTime.now())
                    .build();
            } else {
                log.error("Payment processing failed for booking ID: {}", booking.getBookingId());
                return PaymentResponse.builder()
                    .bookingId(booking.getBookingId())
                    .amount(request.getAmount())
                    .method(request.getMethod())
                    .status("FAILED")
                    .success(false)
                    .message("Payment processing failed")
                    .processedAt(LocalDateTime.now())
                    .build();
            }
            
        } catch (Exception e) {
            log.error("Error processing payment for booking ID: {}", booking.getBookingId(), e);
            return PaymentResponse.builder()
                .bookingId(booking.getBookingId())
                .amount(request.getAmount())
                .method(request.getMethod())
                .status("ERROR")
                .success(false)
                .message("Payment processing error: " + e.getMessage())
                .processedAt(LocalDateTime.now())
                .build();
        }
    }
    
    /**
     * Simulate payment gateway processing
     * In a real implementation, this would integrate with actual payment gateways like Stripe, PayPal, etc.
     */
    private boolean simulatePaymentGateway(PaymentRequest request) {
        try {
            // Simulate network delay
            Thread.sleep(1000);
            
            // Simulate payment validation
            // In real implementation, this would validate with actual payment gateway
            boolean isValidCard = validateCardDetails(request);
            boolean hasSufficientFunds = checkSufficientFunds(request);
            
            return isValidCard && hasSufficientFunds;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment processing interrupted", e);
            return false;
        } catch (Exception e) {
            log.error("Payment gateway simulation error", e);
            return false;
        }
    }
    
    /**
     * Simulate card validation
     * In real implementation, this would validate with payment gateway
     */
    private boolean validateCardDetails(PaymentRequest request) {
        // Simulate card validation logic
        // For demo purposes, accept all VISA and MASTERCARD payments
        log.info("Validating card details for method: {}", request.getMethod());
        boolean isValid = request.getMethod().equals("VISA") || request.getMethod().equals("MASTERCARD");
        log.info("Card validation result: {}", isValid);
        return isValid;
    }
    
    /**
     * Simulate fund availability check
     * In real implementation, this would check with payment gateway
     */
    private boolean checkSufficientFunds(PaymentRequest request) {
        // Simulate fund check
        // For demo purposes, accept all payments under 1,000,000 LKR
        return request.getAmount() < 1000000.0;
    }
    
    /**
     * Generate a unique transaction ID
     */
    private String generateTransactionId() {
        return "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}
