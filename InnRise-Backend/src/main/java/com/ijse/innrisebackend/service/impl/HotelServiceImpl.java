package com.ijse.innrisebackend.service.impl;

import com.ijse.innrisebackend.dto.HotelDTO;
import com.ijse.innrisebackend.entity.Hotel;
import com.ijse.innrisebackend.exception.ValidationException;
import com.ijse.innrisebackend.repository.HotelRepository;
import com.ijse.innrisebackend.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {
    private final HotelRepository hotelRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveHotel(HotelDTO hotelDTO) {
        if(hotelDTO.getName()==null){
            throw new ValidationException("Hotel name is required");
        }
        hotelRepository.save(modelMapper.map(hotelDTO, Hotel.class));
    }

    @Override
    public void updateHotel(HotelDTO hotelDTO) {
        hotelRepository.save(modelMapper.map(hotelDTO, Hotel.class));
    }

    @Override
    public List<HotelDTO> getAllHotels() {
        try {
            // 1️⃣ fetch all hotel entities (simplified approach)
            List<Hotel> hotels = hotelRepository.findAll();
            System.out.println("Found " + hotels.size() + " hotels in database");

            // 2️⃣ manually map to DTOs to avoid ModelMapper issues
            List<HotelDTO> dtos = new ArrayList<>();
            for (Hotel hotel : hotels) {
                HotelDTO dto = new HotelDTO();
                dto.setHotelId(hotel.getHotelId());
                dto.setName(hotel.getName());
                dto.setLocation(hotel.getLocation());
                dto.setAddress(hotel.getAddress());
                dto.setContact_number(hotel.getContact_number());
                dto.setEmail(hotel.getEmail());
                dto.setDescription(hotel.getDescription());
                dto.setStar_rating(hotel.getStar_rating());
                dto.setPrice(hotel.getPrice() != null ? hotel.getPrice() : 0.0);
                
                // Set photos as empty list for now to avoid lazy loading issues
                dto.setPhotos(new ArrayList<>());
                
                dtos.add(dto);
            }
            System.out.println("Mapped to " + dtos.size() + " DTOs");

            return dtos;
        } catch (Exception e) {
            System.err.println("Error in getAllHotels: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }



    @Override
    public void changeHotelStatus(String id) {

    }

    @Override
    public List<HotelDTO> getAllHotelsByKeyword(String keyword) {
        try {
            // Search by both name and location
            List<Hotel> list = hotelRepository.findByNameOrLocationContainingIgnoreCase(keyword);

            // Manually map to DTOs to avoid ModelMapper and lazy loading issues
            List<HotelDTO> dtos = new ArrayList<>();
            for (Hotel hotel : list) {
                HotelDTO dto = new HotelDTO();
                dto.setHotelId(hotel.getHotelId());
                dto.setName(hotel.getName());
                dto.setLocation(hotel.getLocation());
                dto.setAddress(hotel.getAddress());
                dto.setContact_number(hotel.getContact_number());
                dto.setEmail(hotel.getEmail());
                dto.setDescription(hotel.getDescription());
                dto.setStar_rating(hotel.getStar_rating());
                dto.setPrice(hotel.getPrice() != null ? hotel.getPrice() : 0.0);
                
                // Set photos as empty list to avoid lazy loading issues
                dto.setPhotos(new ArrayList<>());
                
                dtos.add(dto);
            }

            return dtos;
        } catch (Exception e) {
            System.err.println("Error in getAllHotelsByKeyword: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }


    @Override
    public List<HotelDTO> filterHotels(String location, String priceRange) {
        Double minPrice = null, maxPrice = null;

        if (priceRange != null) {
            switch (priceRange) {
                case "0-100" -> { minPrice = 0.0; maxPrice = 100.0; }
                case "100-200" -> { minPrice = 100.0; maxPrice = 200.0; }
                case "200-300" -> { minPrice = 200.0; maxPrice = 300.0; }
                case "300+" -> { minPrice = 300.0; }
            }
        }

        List<Hotel> hotels = hotelRepository.filterHotels(location, minPrice, maxPrice);
        return modelMapper.map(hotels, new TypeToken<List<HotelDTO>>() {}.getType());
    }
}
