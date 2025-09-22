package com.ijse.innrisebackend.service;

import com.ijse.innrisebackend.entity.ContactMessage;
import com.ijse.innrisebackend.entity.User;
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
            +94 77 816 9484 or +94 72 254 2656 
            
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


    public boolean sendPasswordResetOTP(User user, String otp) {
        try {
            String emailBody = buildPasswordResetOTPBody(user, otp);

            // Send actual email
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Your InnRise Password Reset Code");
            message.setText(emailBody);

            mailSender.send(message);
            log.info("Password reset OTP email sent successfully to {}", user.getEmail());

            // Also log for debugging
            log.info("=== PASSWORD RESET OTP EMAIL SENT ===");
            log.info("Subject: Your InnRise Password Reset Code");
            log.info("Body:\n{}", emailBody);
            log.info("=== END PASSWORD RESET OTP EMAIL ===");

            return true;

        } catch (Exception e) {
            log.error("Failed to send password reset OTP email: {}", e.getMessage(), e);
            return false;
        }
    }

    private String buildPasswordResetOTPBody(User user, String otp) {
        return String.format("""
            Dear %s %s,

            We received a request to reset your password for your InnRise account.

            Your password reset code is:
            
            🔐 %s
            
            This code will expire in 10 minutes for security reasons.

            If you did not request this password reset, please ignore this email. Your password will remain unchanged.

            For security reasons:
            - Never share this code with anyone
            - This code can only be used once
            - You have 3 attempts to enter the correct code
            - If you suspect unauthorized access, contact us immediately

            If you have any questions or need assistance, please contact us at:
            +94 77 816 9484 or +94 72 254 2656

            Best regards,
            The InnRise Team

            ---
            InnRise - Your trusted partner for hotel bookings in Sri Lanka
            Email: info@innrise.com
            Phone: +94 11 234 5678
            """,
            user.getFirstName(),
            user.getLastName(),
            otp
        );
    }
}
