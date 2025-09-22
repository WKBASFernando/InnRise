package com.ijse.innrisebackend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
    
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    @NotBlank(message = "Payment method is required")
    private String method; // VISA, MASTERCARD
    
    // Card details (for demo purposes - in real implementation, these would be handled securely)
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String cardholderName;
    
    // Billing information
    private String billingAddress;
    private String city;
    private String postalCode;
    private String country;
}
