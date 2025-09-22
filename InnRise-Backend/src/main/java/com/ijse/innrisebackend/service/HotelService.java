package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.dto.HotelDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface HotelService {
    void saveHotel(HotelDTO jobDTO);
    void updateHotel(HotelDTO jobDTO);
    List<HotelDTO> getAllHotels();
    void changeHotelStatus(String id);
    List<HotelDTO> getAllHotelsByKeyword(String status);
    List<HotelDTO> filterHotels(String location, String priceRange);

}
