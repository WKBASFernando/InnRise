package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel,Long> {
    List<Hotel> findByNameContainingIgnoreCase(String keyword);

    @Query("SELECT h FROM Hotel h WHERE " +
            "LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(h.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Hotel> findByNameOrLocationContainingIgnoreCase(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT h FROM Hotel h " +
            "JOIN h.rooms r " +
            "WHERE (:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:minPrice IS NULL OR r.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR r.price <= :maxPrice)")
    List<Hotel> filterHotels(
            @Param("location") String location,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

    @Query("SELECT h FROM Hotel h LEFT JOIN FETCH h.photos LEFT JOIN FETCH h.rooms")
    List<Hotel> findAllWithPhotosAndRooms();

}
