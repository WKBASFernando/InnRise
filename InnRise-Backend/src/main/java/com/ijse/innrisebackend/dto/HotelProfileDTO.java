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
public class HotelProfileDTO {
    private Long hotelId;
    private String name;
    private String location;
    private String address;
    private String contact_number;
    private String email;
    private String description;
    private int star_rating;
    private Double price; // Hotel base price per night
    private List<String> photos = new ArrayList<>();
    private List<RoomDTO> rooms = new ArrayList<>();
    private List<PackageDTO> packages = new ArrayList<>();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomDTO {
        private Long roomId;
        private String type;
        private Double price;
        private String imageUrl; // Backend will provide full image URL
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PackageDTO {
        private Long packageId;
        private String packageName;
        private String description;
        private Double price;
        private String imageUrl; // Backend will provide full image URL
    }
}
