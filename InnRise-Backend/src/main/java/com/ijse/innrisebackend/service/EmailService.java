package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.entity.ContactMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@innrise.com}")
    private String fromEmail;

    @Value("${app.email.admin:angelofernando1609@gmail.com}")
    private String adminEmail;

    public boolean sendContactNotification(ContactMessage contactMessage) {
        try {
            String emailBody = buildContactEmailBody(contactMessage);
            
            // Send actual email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(adminEmail);
            message.setSubject("New Contact Message from InnRise Website - " + contactMessage.getSubject());
            message.setText(emailBody);
            
            mailSender.send(message);
            log.info("Contact notification email sent successfully to {}", adminEmail);
            
            // Also log for debugging
            log.info("=== EMAIL NOTIFICATION SENT ===");
            log.info("Subject: New Contact Message from InnRise Website - {}", contactMessage.getSubject());
            log.info("Body:\n{}", emailBody);
            log.info("=== END EMAIL NOTIFICATION ===");
            
            return true;
            
        } catch (Exception e) {
            log.error("Failed to send contact notification email: {}", e.getMessage(), e);
            return false;
        }
    }

    public boolean sendAutoReply(ContactMessage contactMessage) {
        try {
            String autoReplyBody = buildAutoReplyBody(contactMessage);
            
            // Send actual auto-reply email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(contactMessage.getEmail());
            message.setSubject("Thank you for contacting InnRise - We'll get back to you soon!");
            message.setText(autoReplyBody);
            
            mailSender.send(message);
            log.info("Auto-reply email sent successfully to {}", contactMessage.getEmail());
            
            // Also log for debugging
            log.info("=== AUTO-REPLY EMAIL SENT ===");
            log.info("Subject: Thank you for contacting InnRise - We'll get back to you soon!");
            log.info("Body:\n{}", autoReplyBody);
            log.info("=== END AUTO-REPLY EMAIL ===");
            
            return true;
            
        } catch (Exception e) {
            log.error("Failed to send auto-reply email: {}", e.getMessage(), e);
            return false;
        }
    }

    private String buildContactEmailBody(ContactMessage contactMessage) {
        return String.format("""
            NEW CONTACT MESSAGE RECEIVED
            ============================
            
            Message ID: %d
            Received: %s
            
            CONTACT DETAILS:
            Name: %s %s
            Email: %s
            Phone: %s
            Subject: %s
            
            MESSAGE:
            %s
            
            ---
            This message was sent from the InnRise website contact form.
            Please respond to the customer at: %s
            """,
            contactMessage.getId(),
            contactMessage.getCreatedAt(),
            contactMessage.getFirstName(),
            contactMessage.getLastName(),
            contactMessage.getEmail(),
            contactMessage.getPhone() != null ? contactMessage.getPhone() : "Not provided",
            contactMessage.getSubject(),
            contactMessage.getMessage(),
            contactMessage.getEmail()
        );
    }

    private String buildAutoReplyBody(ContactMessage contactMessage) {
        return String.format("""
            Dear %s %s,
            
            Thank you for contacting InnRise!
            
            We have received your message regarding "%s" and our team will review it shortly.
            
            We typically respond to all inquiries within 24 hours during business days.
            
            If you have any urgent questions, please don't hesitate to call us at:
            +94 11 234 5678 or +94 77 123 4567
            
            Best regards,
            The InnRise Team
            
            ---
            InnRise - Your trusted partner for hotel bookings in Sri Lanka
            Email: info@innrise.com
            Phone: +94 11 234 5678
            """,
            contactMessage.getFirstName(),
            contactMessage.getLastName(),
            contactMessage.getSubject()
        );
    }
}
