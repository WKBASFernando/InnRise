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
                roomDTO.setImageUrl(getRoomImageUrl(room)); // Backend generates image URL
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
                packageDTO.setImageUrl(getPackageImageUrl(pkg)); // Backend generates image URL
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
    private String getRoomImageUrl(Room room) {
        if (room.getImageUrl() != null && !room.getImageUrl().isEmpty()) {
            return getFullImageUrl(room.getImageUrl());
        }
        // Fallback to default room image based on room type
        return getDefaultRoomImageUrl(room.getType());
    }
    
    // Backend business logic: Get default room image based on room type
    private String getDefaultRoomImageUrl(String roomType) {
        if (roomType == null) {
            return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop";
        }
        
        String lowerType = roomType.toLowerCase();
        if (lowerType.contains("suite") || lowerType.contains("presidential")) {
            return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop";
        } else if (lowerType.contains("deluxe") || lowerType.contains("ocean")) {
            return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop";
        } else if (lowerType.contains("family")) {
            return "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop";
        } else if (lowerType.contains("business") || lowerType.contains("executive")) {
            return "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop";
        } else if (lowerType.contains("garden") || lowerType.contains("mountain")) {
            return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop";
        } else if (lowerType.contains("beach") || lowerType.contains("villa")) {
            return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop";
        } else if (lowerType.contains("heritage")) {
            return "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop";
        } else {
            return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop";
        }
    }

    // Backend business logic: Generate package image URLs
    private String getPackageImageUrl(HotelPackage pkg) {
        if (pkg.getImageUrl() != null && !pkg.getImageUrl().isEmpty()) {
            return getFullImageUrl(pkg.getImageUrl());
        }
        // Fallback to default package image based on package name
        return getDefaultPackageImageUrl(pkg.getPackageName());
    }
    
    // Backend business logic: Get default package image based on package name
    private String getDefaultPackageImageUrl(String packageName) {
        if (packageName == null) {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
        }
        
        String lowerName = packageName.toLowerCase();
        if (lowerName.contains("romantic") || lowerName.contains("honeymoon")) {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
        } else if (lowerName.contains("family")) {
            return "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop";
        } else if (lowerName.contains("business")) {
            return "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop";
        } else if (lowerName.contains("adventure") || lowerName.contains("hiking")) {
            return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop";
        } else if (lowerName.contains("cultural") || lowerName.contains("heritage")) {
            return "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop";
        } else if (lowerName.contains("beach") || lowerName.contains("luxury")) {
            return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop";
        } else if (lowerName.contains("water") || lowerName.contains("sports")) {
            return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop";
        } else if (lowerName.contains("tea") || lowerName.contains("country")) {
            return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop";
        } else {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
        }
    }

    // Backend business logic: Get default image URL
    private String getDefaultImageUrl() {
        return "http://localhost:8080/images/default_hotel.jpg";
    }
}
