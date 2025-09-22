package com.ijse.innrisebackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "hotel")
@Data
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Long hotelId;

    // --- Basic Info ---
    @Column(name = "name")
    private String name;
    
    @Column(name = "location")
    private String location;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "contact_number")
    private String contact_number;
    
    @Column(name = "email")
    private String email;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "star_rating")
    private int star_rating; // 1–5 stars
    
    @Column(name = "price")
    private Double price; // Hotel base price per night

    // --- Relationships ---
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HotelPhoto> photos;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Room> rooms;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> bookings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discount_id")
    @JsonIgnore
    private Discount discount;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<HotelPackage> hotelPackages;
    
    // Hotel admin relationship - one hotel can have one hotel admin
    @OneToOne(mappedBy = "hotel", fetch = FetchType.LAZY)
    @JsonIgnore
    private User hotelAdmin;
}
