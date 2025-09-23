-- InnRise Sample Data Script
-- Run this script to populate the database with sample data
-- Note: This script assumes tables already exist (created by Hibernate)

USE innRise;

-- Clear existing data (in correct order due to foreign keys)
-- Using TRUNCATE for better performance and to avoid unsafe DELETE warnings
SET FOREIGN_KEY_CHECKS = 0;
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

-- Insert sample data

-- Insert Users (admin and regular users first, hotel admins will be added after hotels)
INSERT INTO user (first_name, last_name, email, password, role, hotel_id) VALUES
('Angelo', 'Fernando', 'angelofernando1609@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', NULL),
('John', 'Doe', 'john.doe@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL),
('Jane', 'Smith', 'jane.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL);

-- Insert Discounts (updated structure with new fields)
INSERT INTO discount (name, code, percentage, valid_from, valid_to, description) VALUES
('Welcome Discount', 'WELCOME10', 10.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Welcome discount for new customers'),
('Summer Special', 'SUMMER20', 20.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Summer season special discount'),
('Early Bird', 'EARLYBIRD15', 15.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 45 DAY), 'Early booking discount'),
('Loyalty Reward', 'LOYALTY25', 25.00, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 'Loyalty customer reward');

-- Insert Hotels (Prices in LKR)
INSERT INTO hotel (name, location, address, contact_number, email, description, star_rating, price, discount_id) VALUES
('Sunset Paradise Hotel', 'Colombo', '123 Galle Road, Colombo 03', '+94 77 123 4567', 'info@sunsetparadise.com', 'A luxurious beachfront hotel with stunning ocean views and world-class amenities.', 5, 15000.00, 1),
('Mountain View Resort', 'Kandy', '456 Peradeniya Road, Kandy', '+94 81 234 5678', 'reservations@mountainview.com', 'Nestled in the hills of Kandy, offering panoramic views and serene surroundings.', 4, 8500.00, 2),
('City Center Hotel', 'Colombo', '789 Union Place, Colombo 02', '+94 11 345 6789', 'bookings@citycenter.com', 'Modern hotel in the heart of Colombo with easy access to business districts.', 4, 12000.00, 1),
('Beachfront Villa', 'Galle', '321 Unawatuna Road, Galle', '+94 91 456 7890', 'info@beachfrontvilla.com', 'Exclusive beachfront property with private beach access and luxury amenities.', 5, 18000.00, 3),
('Heritage Inn', 'Anuradhapura', '654 Sacred City Road, Anuradhapura', '+94 25 567 8901', 'stay@heritageinn.com', 'Historic hotel near ancient temples, offering cultural experiences.', 3, 4500.00, 4),
('Tropical Resort', 'Negombo', '987 Beach Road, Negombo', '+94 31 678 9012', 'resort@tropical.com', 'Family-friendly resort with water sports and entertainment facilities.', 4, 7500.00, 2),
('Business Hotel', 'Colombo', '147 Independence Avenue, Colombo 07', '+94 11 789 0123', 'business@hotel.com', 'Executive hotel designed for business travelers with meeting facilities.', 4, 11000.00, 1),
('Garden Hotel', 'Nuwara Eliya', '258 Gregory Lake Road, Nuwara Eliya', '+94 52 890 1234', 'garden@hotel.com', 'Charming hotel surrounded by tea plantations and cool mountain air.', 3, 6500.00, 3),
('Luxury Suites', 'Colombo', '369 Marine Drive, Colombo 03', '+94 11 901 2345', 'luxury@suites.com', 'Premium accommodation with personalized service and exclusive amenities.', 5, 22000.00, 4),
('Budget Inn', 'Colombo', '741 Pettah Market, Colombo 11', '+94 11 012 3456', 'budget@inn.com', 'Affordable accommodation in the bustling market area.', 2, 2500.00, 1),
('Seaside Hotel', 'Trincomalee', '852 Nilaveli Beach, Trincomalee', '+94 26 123 4567', 'seaside@hotel.com', 'Beachfront hotel with diving and water sports activities.', 4, 9000.00, 2);

-- Insert Hotel Admin Users (after hotels are created)
INSERT INTO user (first_name, last_name, email, password, role, hotel_id) VALUES
('Hotel', 'Manager', 'manager@sunsetparadise.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 1),
('Resort', 'Admin', 'admin@mountainview.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 2);

-- Insert Hotel Photos (using placeholder image services)
INSERT INTO hotel_photo (hotel_id, url) VALUES
(1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'),
(1, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'),
(4, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(4, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'),
(5, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'),
(5, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
(6, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'),
(7, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'),
(8, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(9, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'),
(10, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'),
(11, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop');

-- Insert Rooms (Prices in LKR) with images
INSERT INTO room (hotel_id, type, price, image_url) VALUES
(1, 'Deluxe Ocean View', 15000.00, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'),
(1, 'Standard Room', 12000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(1, 'Presidential Suite', 24000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(2, 'Mountain View Room', 8500.00, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
(2, 'Standard Room', 7000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(3, 'Executive Room', 12000.00, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'),
(3, 'Standard Room', 10000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(4, 'Beachfront Villa', 18000.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(4, 'Garden Villa', 15000.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(5, 'Heritage Room', 4500.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'),
(6, 'Family Room', 7500.00, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'),
(6, 'Standard Room', 6000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(7, 'Business Suite', 11000.00, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'),
(7, 'Executive Room', 9000.00, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop'),
(8, 'Garden View Room', 6500.00, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
(9, 'Luxury Suite', 22000.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(10, 'Budget Room', 2500.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'),
(11, 'Beach View Room', 9000.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop');

-- Insert Hotel Packages (Prices in LKR) with images
INSERT INTO hotel_package (hotel_id, package_name, description, price, image_url) VALUES
(1, 'Romantic Getaway', '2 nights with dinner and spa treatment', 36000.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'),
(1, 'Family Package', '3 nights with breakfast and kids activities', 48000.00, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'),
(2, 'Adventure Package', '2 nights with hiking and sightseeing tours', 27000.00, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'),
(4, 'Luxury Beach Package', '3 nights with all meals and water sports', 72000.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'),
(6, 'Family Fun Package', '2 nights with entertainment and meals', 24000.00, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop');

-- Insert Sample Bookings (Amounts in LKR) - Updated with room_id
INSERT INTO booking (user_id, hotel_id, room_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, special_requests, total_amount, status) VALUES
(2, 1, 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 9 DAY), 2, 1, 'Late check-in requested, anniversary celebration', 30000.00, 'CONFIRMED'),
(3, 2, 4, DATE_ADD(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 2, 1, 'Vegetarian meals preferred, mountain view room', 17000.00, 'CONFIRMED'),
(2, 4, 8, DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 18 DAY), 4, 2, 'Family vacation with children, beachfront villa', 108000.00, 'PENDING'),
(3, 6, 11, DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 22 DAY), 3, 1, 'Family with young children, pool access needed', 15000.00, 'CONFIRMED');

-- Insert Sample Payments (Amounts in LKR) - Updated to match actual table structure
INSERT INTO payment (booking_id, amount, method) VALUES
(1, 30000.00, 'VISA'),
(2, 17000.00, 'MASTERCARD'),
(4, 15000.00, 'VISA');

-- Insert Sample Feedback
INSERT INTO feedback (booking_id, rating, comment) VALUES
(1, 5, 'Excellent service and beautiful ocean view. Highly recommended!'),
(2, 4, 'Great location and friendly staff. Room was clean and comfortable.'),
(4, 5, 'Perfect for families. Kids loved the activities and pool.');

-- Show summary
SELECT 'Sample data insertion completed successfully!' as Status;
SELECT COUNT(*) as 'Total Users' FROM user;
SELECT COUNT(*) as 'Total Hotels' FROM hotel;
SELECT COUNT(*) as 'Total Rooms' FROM room;
SELECT COUNT(*) as 'Total Bookings' FROM booking;
SELECT COUNT(*) as 'Total Discounts' FROM discount;

-- Show user roles distribution
SELECT role, COUNT(*) as count FROM user GROUP BY role;

-- Show hotel distribution by location
SELECT location, COUNT(*) as count FROM hotel GROUP BY location ORDER BY count DESC;
