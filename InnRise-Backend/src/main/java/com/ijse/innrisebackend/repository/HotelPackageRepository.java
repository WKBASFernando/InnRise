package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.HotelPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelPackageRepository extends JpaRepository<HotelPackage, Long> {
    List<HotelPackage> findByHotelHotelId(Long hotelId);
}
