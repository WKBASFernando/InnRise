package com.ijse.innrisebackend.entity;

import com.ijse.innrisebackend.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
