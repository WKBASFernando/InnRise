package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);   // find a user by email
    boolean existsByEmail(String email);        // check if email is already registered
}
