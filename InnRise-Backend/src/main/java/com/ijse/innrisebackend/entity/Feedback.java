package com.ijse.innrisebackend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    private String comment;
    private int rating;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

}
