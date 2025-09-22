package com.ijse.innrisebackend.controller;

import com.ijse.innrisebackend.dto.ApiResponse;
import com.ijse.innrisebackend.dto.ContactRequest;
import com.ijse.innrisebackend.dto.ContactResponse;
import com.ijse.innrisebackend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/innrise/contact")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitContactMessage(@Valid @RequestBody ContactRequest request) {
        try {
            log.info("Received contact form submission from: {} {}", request.getFirstName(), request.getLastName());
            
            ContactResponse response = contactService.submitContactMessage(request);
            
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact message submitted successfully",
                response
            ));
            
        } catch (Exception e) {
            log.error("Error processing contact form submission: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500,
                "Failed to process contact message",
                e.getMessage()
            ));
        }
    }

    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllContactMessages() {
        try {
            List<ContactResponse> messages = contactService.getAllContactMessages();
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact messages retrieved successfully",
                messages
            ));
        } catch (Exception e) {
            log.error("Error retrieving contact messages: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500,
                "Failed to retrieve contact messages",
                e.getMessage()
            ));
        }
    }

    @GetMapping("/messages/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getContactMessagesByStatus(@PathVariable String status) {
        try {
            List<ContactResponse> messages = contactService.getContactMessagesByStatus(status);
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact messages retrieved successfully",
                messages
            ));
        } catch (Exception e) {
            log.error("Error retrieving contact messages by status {}: {}", status, e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500,
                "Failed to retrieve contact messages",
                e.getMessage()
            ));
        }
    }

    @GetMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getContactMessageById(@PathVariable Long id) {
        try {
            ContactResponse message = contactService.getContactMessageById(id);
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact message retrieved successfully",
                message
            ));
        } catch (Exception e) {
            log.error("Error retrieving contact message with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(404).body(new ApiResponse(
                404,
                "Contact message not found",
                e.getMessage()
            ));
        }
    }

    @PutMapping("/messages/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateContactMessageStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes) {
        try {
            ContactResponse response = contactService.updateContactMessageStatus(id, status, adminNotes);
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact message status updated successfully",
                response
            ));
        } catch (Exception e) {
            log.error("Error updating contact message status: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500,
                "Failed to update contact message status",
                e.getMessage()
            ));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getContactStats() {
        try {
            long totalMessages = contactService.getContactMessageCount();
            long unreadMessages = contactService.getUnreadContactMessageCount();
            
            return ResponseEntity.ok(new ApiResponse(
                200,
                "Contact statistics retrieved successfully",
                new ContactStatsResponse(totalMessages, unreadMessages)
            ));
        } catch (Exception e) {
            log.error("Error retrieving contact statistics: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new ApiResponse(
                500,
                "Failed to retrieve contact statistics",
                e.getMessage()
            ));
        }
    }

    // Inner class for stats response
    public static class ContactStatsResponse {
        private final long totalMessages;
        private final long unreadMessages;

        public ContactStatsResponse(long totalMessages, long unreadMessages) {
            this.totalMessages = totalMessages;
            this.unreadMessages = unreadMessages;
        }

        public long getTotalMessages() {
            return totalMessages;
        }

        public long getUnreadMessages() {
            return unreadMessages;
        }
    }
}
