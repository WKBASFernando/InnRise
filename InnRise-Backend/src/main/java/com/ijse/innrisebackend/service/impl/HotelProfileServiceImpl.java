package com.ijse.innrisebackend.service.impl;

import com.ijse.innrisebackend.dto.HotelProfileDTO;
import com.ijse.innrisebackend.entity.Hotel;
import com.ijse.innrisebackend.entity.HotelPackage;
import com.ijse.innrisebackend.entity.HotelPhoto;
import com.ijse.innrisebackend.entity.Room;
import com.ijse.innrisebackend.repository.HotelPackageRepository;
import com.ijse.innrisebackend.repository.HotelPhotoRepository;
import com.ijse.innrisebackend.repository.HotelRepository;
import com.ijse.innrisebackend.repository.RoomRepository;
import com.ijse.innrisebackend.service.HotelProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelProfileServiceImpl implements HotelProfileService {

    private final HotelRepository hotelRepository;
    private final HotelPhotoRepository hotelPhotoRepository;
    private final RoomRepository roomRepository;
    private final HotelPackageRepository hotelPackageRepository;

    @Override
    public HotelProfileDTO getHotelProfile(Long hotelId) {
        try {
            // Get hotel details
            Optional<Hotel> hotelOpt = hotelRepository.findById(hotelId);
            if (hotelOpt.isEmpty()) {
                throw new RuntimeException("Hotel not found with ID: " + hotelId);
            }

            Hotel hotel = hotelOpt.get();
            HotelProfileDTO profileDTO = new HotelProfileDTO();

            // Map basic hotel information
            profileDTO.setHotelId(hotel.getHotelId());
            profileDTO.setName(hotel.getName());
            profileDTO.setLocation(hotel.getLocation());
            profileDTO.setAddress(hotel.getAddress());
            profileDTO.setContact_number(hotel.getContact_number());
            profileDTO.setEmail(hotel.getEmail());
            profileDTO.setDescription(hotel.getDescription());
            profileDTO.setStar_rating(hotel.getStar_rating());
            profileDTO.setPrice(hotel.getPrice() != null ? hotel.getPrice() : 0.0);

            // Get and map photos with full URLs (backend business logic)
            List<HotelPhoto> photos = hotelPhotoRepository.findByHotelHotelId(hotelId);
            List<String> photoUrls = new ArrayList<>();
            for (HotelPhoto photo : photos) {
                String fullUrl = getFullImageUrl(photo.getUrl());
                photoUrls.add(fullUrl);
            }
            profileDTO.setPhotos(photoUrls);

            // Get and map rooms with full URLs (backend business logic)
            List<Room> rooms = roomRepository.findByHotelHotelId(hotelId);
            List<HotelProfileDTO.RoomDTO> roomDTOs = new ArrayList<>();
            for (Room room : rooms) {
                HotelProfileDTO.RoomDTO roomDTO = new HotelProfileDTO.RoomDTO();
                roomDTO.setRoomId(room.getRoomId());
                roomDTO.setType(room.getType());
                roomDTO.setPrice(room.getPrice());
                roomDTO.setImageUrl(getRoomImageUrl(room.getRoomId())); // Backend generates image URL
                roomDTOs.add(roomDTO);
            }
            profileDTO.setRooms(roomDTOs);

            // Get and map packages with full URLs (backend business logic)
            List<HotelPackage> packages = hotelPackageRepository.findByHotelHotelId(hotelId);
            List<HotelProfileDTO.PackageDTO> packageDTOs = new ArrayList<>();
            for (HotelPackage pkg : packages) {
                HotelProfileDTO.PackageDTO packageDTO = new HotelProfileDTO.PackageDTO();
                packageDTO.setPackageId(pkg.getPackageId());
                packageDTO.setPackageName(pkg.getPackageName());
                packageDTO.setDescription(pkg.getDescription());
                packageDTO.setPrice(pkg.getPrice());
                packageDTO.setImageUrl(getPackageImageUrl(pkg.getPackageId())); // Backend generates image URL
                packageDTOs.add(packageDTO);
            }
            profileDTO.setPackages(packageDTOs);

            log.info("Hotel profile retrieved successfully for hotel ID: {}", hotelId);
            return profileDTO;

        } catch (Exception e) {
            log.error("Error retrieving hotel profile for ID {}: {}", hotelId, e.getMessage());
            throw new RuntimeException("Failed to retrieve hotel profile: " + e.getMessage());
        }
    }

    // Backend business logic: Generate full image URLs
    private String getFullImageUrl(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            return getDefaultImageUrl();
        }
        
        if (relativePath.startsWith("http")) {
            return relativePath; // Already a full URL
        }
        
        if (relativePath.startsWith("/")) {
            return "http://localhost:8080" + relativePath;
        }
        
        return "http://localhost:8080/images/" + relativePath;
    }

    // Backend business logic: Generate room image URLs
    private String getRoomImageUrl(Long roomId) {
        // Backend logic to determine room image
        // For now, return a default room image
        return "http://localhost:8080/images/room_" + roomId + ".jpg";
    }

    // Backend business logic: Generate package image URLs
    private String getPackageImageUrl(Long packageId) {
        // Backend logic to determine package image
        // For now, return a default package image
        return "http://localhost:8080/images/package_" + packageId + ".jpg";
    }

    // Backend business logic: Get default image URL
    private String getDefaultImageUrl() {
        return "http://localhost:8080/images/default_hotel.jpg";
    }
}
