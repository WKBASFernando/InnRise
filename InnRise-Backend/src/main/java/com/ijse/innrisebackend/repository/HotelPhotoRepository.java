package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.HotelPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelPhotoRepository extends JpaRepository<HotelPhoto, Long> {
    List<HotelPhoto> findByHotelHotelId(Long hotelId);
}
