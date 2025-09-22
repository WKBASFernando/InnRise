package com.ijse.innrisebackend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private Long paymentId;
    private Long bookingId;
    private Double amount;
    private String method;
    private String status; // COMPLETED, FAILED, ERROR
    private boolean success;
    private String message;
    private String transactionId;
    private LocalDateTime processedAt;
    
    // Additional payment details
    private String referenceNumber;
    private String gatewayResponse;
}
