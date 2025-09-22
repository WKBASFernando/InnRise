package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.dto.ContactRequest;
import com.ijse.innrisebackend.dto.ContactResponse;
import com.ijse.innrisebackend.entity.ContactMessage;
import com.ijse.innrisebackend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    @Transactional
    public ContactResponse submitContactMessage(ContactRequest request) {
        try {
            log.info("Processing contact message from: {} {}", request.getFirstName(), request.getLastName());

            // Create and save contact message
            ContactMessage contactMessage = ContactMessage.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .subject(request.getSubject())
                    .message(request.getMessage())
                    .status("NEW")
                    .createdAt(LocalDateTime.now())
                    .build();

            ContactMessage savedMessage = contactRepository.save(contactMessage);
            log.info("Contact message saved with ID: {}", savedMessage.getId());

            // Send notification email to admin
            boolean emailSent = emailService.sendContactNotification(savedMessage);
            
            // Send auto-reply to customer
            boolean autoReplySent = emailService.sendAutoReply(savedMessage);

            // Build response
            ContactResponse response = ContactResponse.builder()
                    .id(savedMessage.getId())
                    .firstName(savedMessage.getFirstName())
                    .lastName(savedMessage.getLastName())
                    .email(savedMessage.getEmail())
                    .phone(savedMessage.getPhone())
                    .subject(savedMessage.getSubject())
                    .message(savedMessage.getMessage())
                    .status(savedMessage.getStatus())
                    .createdAt(savedMessage.getCreatedAt())
                    .emailSent(emailSent)
                    .responseMessage("Thank you for your message! We have received your inquiry and will get back to you within 24 hours.")
                    .build();

            log.info("Contact message processed successfully. Email sent: {}, Auto-reply sent: {}", emailSent, autoReplySent);
            return response;

        } catch (Exception e) {
            log.error("Error processing contact message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process contact message: " + e.getMessage());
        }
    }

    public List<ContactResponse> getAllContactMessages() {
        try {
            List<ContactMessage> messages = contactRepository.findAllByOrderByCreatedAtDesc();
            return messages.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving contact messages: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve contact messages: " + e.getMessage());
        }
    }

    public List<ContactResponse> getContactMessagesByStatus(String status) {
        try {
            List<ContactMessage> messages = contactRepository.findByStatusOrderByCreatedAtDesc(status);
            return messages.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error retrieving contact messages by status {}: {}", status, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve contact messages: " + e.getMessage());
        }
    }

    public ContactResponse getContactMessageById(Long id) {
        try {
            ContactMessage message = contactRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Contact message not found with ID: " + id));
            return convertToResponse(message);
        } catch (Exception e) {
            log.error("Error retrieving contact message with ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to retrieve contact message: " + e.getMessage());
        }
    }

    @Transactional
    public ContactResponse updateContactMessageStatus(Long id, String status, String adminNotes) {
        try {
            ContactMessage message = contactRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Contact message not found with ID: " + id));

            message.setStatus(status);
            message.setAdminNotes(adminNotes);
            message.setUpdatedAt(LocalDateTime.now());

            ContactMessage updatedMessage = contactRepository.save(message);
            log.info("Contact message status updated to: {} for ID: {}", status, id);

            return convertToResponse(updatedMessage);
        } catch (Exception e) {
            log.error("Error updating contact message status: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update contact message: " + e.getMessage());
        }
    }

    public long getContactMessageCount() {
        try {
            return contactRepository.count();
        } catch (Exception e) {
            log.error("Error getting contact message count: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get contact message count: " + e.getMessage());
        }
    }

    public long getUnreadContactMessageCount() {
        try {
            return contactRepository.countByStatus("NEW");
        } catch (Exception e) {
            log.error("Error getting unread contact message count: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get unread contact message count: " + e.getMessage());
        }
    }

    private ContactResponse convertToResponse(ContactMessage message) {
        return ContactResponse.builder()
                .id(message.getId())
                .firstName(message.getFirstName())
                .lastName(message.getLastName())
                .email(message.getEmail())
                .phone(message.getPhone())
                .subject(message.getSubject())
                .message(message.getMessage())
                .status(message.getStatus())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .adminNotes(message.getAdminNotes())
                .build();
    }
}
