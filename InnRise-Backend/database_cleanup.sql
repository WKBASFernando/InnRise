-- InnRise Database Cleanup Script
-- This script clears all existing data to resolve foreign key constraint issues
-- Run this script before starting the application if you encounter foreign key errors

USE innRise;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all tables in the correct order (child tables first)
TRUNCATE TABLE feedback;
TRUNCATE TABLE payment;
TRUNCATE TABLE booking;
TRUNCATE TABLE room;
TRUNCATE TABLE hotel_photo;
TRUNCATE TABLE hotel_package;
TRUNCATE TABLE hotel;
TRUNCATE TABLE discount;
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE user;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto-increment counters
ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE discount AUTO_INCREMENT = 1;
ALTER TABLE hotel AUTO_INCREMENT = 1;
ALTER TABLE room AUTO_INCREMENT = 1;
ALTER TABLE hotel_package AUTO_INCREMENT = 1;
ALTER TABLE booking AUTO_INCREMENT = 1;
ALTER TABLE payment AUTO_INCREMENT = 1;
ALTER TABLE feedback AUTO_INCREMENT = 1;
ALTER TABLE refresh_tokens AUTO_INCREMENT = 1;

-- Optional: Drop and recreate foreign key constraints if they exist
-- This ensures clean constraint creation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing foreign key constraints if they exist
ALTER TABLE user DROP FOREIGN KEY IF EXISTS FK1m1qn3edjeuhxd21p502t9rs4;
ALTER TABLE booking DROP FOREIGN KEY IF EXISTS FK_booking_hotel;
ALTER TABLE booking DROP FOREIGN KEY IF EXISTS FK_booking_user;
ALTER TABLE booking DROP FOREIGN KEY IF EXISTS FK_booking_room;
ALTER TABLE room DROP FOREIGN KEY IF EXISTS FK_room_hotel;
ALTER TABLE hotel_photo DROP FOREIGN KEY IF EXISTS FK_hotel_photo_hotel;
ALTER TABLE hotel_package DROP FOREIGN KEY IF EXISTS FK_hotel_package_hotel;
ALTER TABLE hotel DROP FOREIGN KEY IF EXISTS FK_hotel_discount;
ALTER TABLE payment DROP FOREIGN KEY IF EXISTS FK_payment_booking;
ALTER TABLE feedback DROP FOREIGN KEY IF EXISTS FK_feedback_booking;
ALTER TABLE refresh_tokens DROP FOREIGN KEY IF EXISTS FK_refresh_tokens_user;

-- Add image_url columns to room and hotel_package tables if they don't exist
ALTER TABLE room ADD COLUMN image_url VARCHAR(500);
ALTER TABLE hotel_package ADD COLUMN image_url VARCHAR(500);

SET FOREIGN_KEY_CHECKS = 1;

-- The application will recreate the foreign key constraints when it starts
-- Now you can run the sample data script to populate the database

SELECT 'Database cleanup completed successfully. You can now start the application.' as Status;
