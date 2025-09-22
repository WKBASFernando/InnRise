package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {
    
    Optional<Discount> findByCode(String code);
    
    List<Discount> findByValidFromLessThanEqualAndValidToGreaterThanEqual(LocalDate date, LocalDate date2);
    
    @Query("SELECT d FROM Discount d WHERE d.validFrom <= :date AND d.validTo >= :date")
    List<Discount> findActiveDiscounts(@Param("date") LocalDate date);
    
    @Query("SELECT d FROM Discount d WHERE d.name LIKE %:name%")
    List<Discount> findByNameContaining(@Param("name") String name);
}
