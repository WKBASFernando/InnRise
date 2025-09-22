package com.ijse.innrisebackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HotelDTO {
    private Long hotelId;
    private String name;
    private String location;
    private String address;
    private String contact_number;
    private String email;
    private String description;
    private int star_rating;
    private Double price; // Hotel base price per night
    private Long discountId; // instead of full Discount object
    private List<String> photos = new ArrayList<>();
}
