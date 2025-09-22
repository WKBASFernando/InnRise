package com.ijse.innrisebackend.repository;

import com.ijse.innrisebackend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    
    // Find messages by status
    List<ContactMessage> findByStatus(String status);
    
    // Find messages by email
    List<ContactMessage> findByEmail(String email);
    
    // Find messages by subject
    List<ContactMessage> findBySubject(String subject);
    
    // Find messages created between dates
    List<ContactMessage> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find unread messages (status = NEW)
    List<ContactMessage> findByStatusOrderByCreatedAtDesc(String status);
    
    // Count messages by status
    long countByStatus(String status);
    
    // Find recent messages (last 30 days)
    @Query("SELECT c FROM ContactMessage c WHERE c.createdAt >= :thirtyDaysAgo ORDER BY c.createdAt DESC")
    List<ContactMessage> findRecentMessages(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Find all messages ordered by creation date (newest first)
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    
    // Search messages by content
    @Query("SELECT c FROM ContactMessage c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY c.createdAt DESC")
    List<ContactMessage> searchMessages(@Param("keyword") String keyword);
}
