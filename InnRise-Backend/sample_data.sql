-- ==================== SAMPLE DATA FOR INNRISE DATABASE ====================
-- This script creates sample data for the InnRise application
-- Run this after the application has created the tables via Hibernate

USE innRise;

-- ==================== CLEAR EXISTING DATA ====================
-- Delete in reverse order of dependencies
DELETE FROM booking WHERE booking_id > 0;
DELETE FROM hotel_package WHERE package_id > 0;
DELETE FROM room WHERE room_id > 0;
DELETE FROM hotel_photo WHERE id > 0;
DELETE FROM hotel WHERE hotel_id > 0;
DELETE FROM discount WHERE discount_id > 0;
DELETE FROM user WHERE id > 0;

-- ==================== DISCOUNTS ====================
INSERT INTO discount (name, code, percentage, valid_from, valid_to, description) VALUES
('Summer Special', 'SUMMER2024', 15.0, '2024-06-01', '2024-08-31', 'Summer vacation discount'),
('Early Bird', 'EARLY2024', 10.0, '2024-01-01', '2024-12-31', 'Book early and save'),
('Weekend Getaway', 'WEEKEND', 20.0, '2024-01-01', '2024-12-31', 'Weekend special rates'),
('Corporate Rate', 'CORP2024', 25.0, '2024-01-01', '2024-12-31', 'Corporate booking discount');

-- ==================== HOTELS ====================
INSERT INTO hotel (name, location, address, contact_number, email, description, star_rating, price, discount_id) VALUES
('Grand Colombo Hotel', 'Colombo', '123 Galle Road, Colombo 03', '+94 11 234 5678', 'info@grandcolombo.com', 'Luxury hotel in the heart of Colombo with stunning ocean views and world-class amenities.', 5, 25000.00, 1),
('Mountain View Resort', 'Kandy', '456 Peradeniya Road, Kandy', '+94 81 234 5678', 'info@mountainview.com', 'Serene mountain resort offering breathtaking views of the Kandy hills and traditional Sri Lankan hospitality.', 4, 18000.00, 2),
('Beach Paradise Hotel', 'Galle', '789 Unawatuna Road, Galle', '+94 91 234 5678', 'info@beachparadise.com', 'Beachfront hotel with direct access to pristine beaches and modern facilities.', 4, 22000.00, 3),
('Heritage Boutique Hotel', 'Anuradhapura', '321 Sacred City Road, Anuradhapura', '+94 25 234 5678', 'info@heritageboutique.com', 'Historic hotel near ancient temples offering cultural experiences and traditional architecture.', 3, 12000.00, 4),
('Hill Country Lodge', 'Nuwara Eliya', '654 Tea Estate Road, Nuwara Eliya', '+94 52 234 5678', 'info@hillcountry.com', 'Cozy lodge in the tea country with cool climate and scenic tea plantations.', 3, 15000.00, 1),
('Coastal Retreat', 'Trincomalee', '987 Beach Road, Trincomalee', '+94 26 234 5678', 'info@coastalretreat.com', 'Peaceful coastal hotel with pristine beaches and excellent diving opportunities.', 4, 20000.00, 2);

-- ==================== USERS ====================
-- Admin User
INSERT INTO user (first_name, last_name, email, password, role, hotel_id) VALUES
('Angelo', 'Fernando', 'angelofernando1609@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', NULL);

-- Hotel Admin Users (one for each hotel)
INSERT INTO user (first_name, last_name, email, password, role, hotel_id) VALUES
('Sarah', 'Perera', 'sarah.perera@grandcolombo.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 1),
('Rajesh', 'Kumar', 'rajesh.kumar@mountainview.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 2),
('Priya', 'Silva', 'priya.silva@beachparadise.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 3),
('Nimal', 'Wijesinghe', 'nimal.wijesinghe@heritageboutique.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 4),
('Kamala', 'Fernando', 'kamala.fernando@hillcountry.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 5),
('Suresh', 'Rajapaksa', 'suresh.rajapaksa@coastalretreat.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'HOTEL_ADMIN', 6);

-- Regular Users
INSERT INTO user (first_name, last_name, email, password, role, hotel_id) VALUES
('John', 'Smith', 'john.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL),
('Emily', 'Johnson', 'emily.johnson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL),
('David', 'Brown', 'david.brown@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL),
('Lisa', 'Wilson', 'lisa.wilson@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL),
('Michael', 'Davis', 'michael.davis@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER', NULL);

-- ==================== HOTEL PHOTOS ====================
INSERT INTO hotel_photo (url, hotel_id) VALUES
-- Grand Colombo Hotel
('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 1),
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 1),
('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 1),
-- Mountain View Resort
('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 2),
('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 2),
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 2),
-- Beach Paradise Hotel
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 3),
('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 3),
('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 3),
-- Heritage Boutique Hotel
('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 4),
('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 4),
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 4),
-- Hill Country Lodge
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 5),
('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 5),
('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 5),
-- Coastal Retreat
('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 6),
('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 6),
('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 6);

-- ==================== ROOMS ====================
INSERT INTO room (type, price, hotel_id) VALUES
-- Grand Colombo Hotel (Hotel ID: 1)
('Deluxe Ocean View', 35000.00, 1),
('Executive Suite', 45000.00, 1),
('Presidential Suite', 65000.00, 1),
('Standard Room', 25000.00, 1),
('Family Room', 40000.00, 1),

-- Mountain View Resort (Hotel ID: 2)
('Mountain View Room', 22000.00, 2),
('Garden Villa', 28000.00, 2),
('Standard Room', 18000.00, 2),
('Deluxe Suite', 32000.00, 2),
('Family Villa', 35000.00, 2),

-- Beach Paradise Hotel (Hotel ID: 3)
('Beachfront Villa', 30000.00, 3),
('Ocean View Suite', 35000.00, 3),
('Standard Beach Room', 22000.00, 3),
('Deluxe Ocean Room', 28000.00, 3),
('Family Beach Villa', 40000.00, 3),

-- Heritage Boutique Hotel (Hotel ID: 4)
('Heritage Room', 15000.00, 4),
('Temple View Room', 18000.00, 4),
('Standard Room', 12000.00, 4),
('Deluxe Heritage Suite', 20000.00, 4),
('Cultural Villa', 25000.00, 4),

-- Hill Country Lodge (Hotel ID: 5)
('Tea Garden Room', 18000.00, 5),
('Mountain View Room', 20000.00, 5),
('Standard Room', 15000.00, 5),
('Deluxe Lodge Room', 22000.00, 5),
('Family Cottage', 28000.00, 5),

-- Coastal Retreat (Hotel ID: 6)
('Beach Bungalow', 25000.00, 6),
('Ocean View Room', 28000.00, 6),
('Standard Room', 20000.00, 6),
('Deluxe Beach Room', 32000.00, 6),
('Family Beach House', 38000.00, 6);

-- ==================== HOTEL PACKAGES ====================
INSERT INTO hotel_package (package_name, description, price, created_at, hotel_id) VALUES
-- Grand Colombo Hotel
('City Explorer Package', '3 days 2 nights with city tour and airport transfers', 75000.00, NOW(), 1),
('Luxury Spa Package', '2 days 1 night with full spa treatment and fine dining', 55000.00, NOW(), 1),
('Business Package', '1 day with meeting room and business facilities', 35000.00, NOW(), 1),

-- Mountain View Resort
('Mountain Adventure Package', '4 days 3 nights with hiking and nature tours', 65000.00, NOW(), 2),
('Romantic Getaway', '2 days 1 night with candlelight dinner and mountain views', 45000.00, NOW(), 2),
('Family Fun Package', '3 days 2 nights with family activities and meals', 55000.00, NOW(), 2),

-- Beach Paradise Hotel
('Beach Paradise Package', '3 days 2 nights with water sports and beach activities', 70000.00, NOW(), 3),
('Diving Adventure', '2 days 1 night with diving equipment and instructor', 50000.00, NOW(), 3),
('Sunset Romance', '2 days 1 night with sunset cruise and beach dinner', 45000.00, NOW(), 3),

-- Heritage Boutique Hotel
('Cultural Heritage Tour', '3 days 2 nights with temple visits and cultural shows', 40000.00, NOW(), 4),
('Ancient City Explorer', '2 days 1 night with guided temple tours', 30000.00, NOW(), 4),
('Spiritual Retreat', '4 days 3 nights with meditation and temple visits', 50000.00, NOW(), 4),

-- Hill Country Lodge
('Tea Estate Experience', '3 days 2 nights with tea factory tour and plantation walk', 45000.00, NOW(), 5),
('Cool Climate Escape', '2 days 1 night with nature walks and cool weather', 35000.00, NOW(), 5),
('Family Adventure', '3 days 2 nights with family activities in tea country', 50000.00, NOW(), 5),

-- Coastal Retreat
('Diving Paradise', '3 days 2 nights with diving and snorkeling equipment', 60000.00, NOW(), 6),
('Beach Relaxation', '2 days 1 night with beach activities and relaxation', 40000.00, NOW(), 6),
('Marine Adventure', '4 days 3 nights with whale watching and marine tours', 75000.00, NOW(), 6);

-- ==================== SAMPLE BOOKINGS ====================
INSERT INTO booking (user_id, hotel_id, room_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, special_requests, total_amount, status) VALUES
-- Bookings for John Smith (User ID: 8)
(8, 1, 1, '2024-02-15', '2024-02-17', 2, 1, 'High floor room preferred', 70000.00, 'CONFIRMED'),
(8, 2, 6, '2024-03-10', '2024-03-12', 2, 1, 'Mountain view room', 44000.00, 'PENDING'),

-- Bookings for Emily Johnson (User ID: 9)
(9, 3, 11, '2024-02-20', '2024-02-22', 2, 1, 'Beachfront villa with balcony', 60000.00, 'CONFIRMED'),
(9, 4, 16, '2024-04-05', '2024-04-07', 2, 1, 'Heritage room with temple view', 30000.00, 'CONFIRMED'),

-- Bookings for David Brown (User ID: 10)
(10, 5, 21, '2024-03-15', '2024-03-17', 4, 2, 'Family cottage for 4 people', 56000.00, 'CONFIRMED'),
(10, 6, 26, '2024-05-01', '2024-05-03', 2, 1, 'Beach bungalow with ocean view', 50000.00, 'PENDING'),

-- Bookings for Lisa Wilson (User ID: 11)
(11, 1, 2, '2024-02-25', '2024-02-27', 2, 1, 'Executive suite with city view', 90000.00, 'CONFIRMED'),
(11, 3, 12, '2024-04-10', '2024-04-12', 2, 1, 'Ocean view suite', 70000.00, 'CONFIRMED'),

-- Bookings for Michael Davis (User ID: 12)
(12, 2, 7, '2024-03-20', '2024-03-22', 2, 1, 'Garden villa with private garden', 56000.00, 'CONFIRMED'),
(12, 4, 17, '2024-05-15', '2024-05-17', 2, 1, 'Temple view room', 36000.00, 'PENDING');

-- ==================== VERIFICATION QUERIES ====================
-- Uncomment these to verify the data was inserted correctly

-- SELECT 'Users' as Table_Name, COUNT(*) as Count FROM user
-- UNION ALL
-- SELECT 'Hotels', COUNT(*) FROM hotel
-- UNION ALL
-- SELECT 'Rooms', COUNT(*) FROM room
-- UNION ALL
-- SELECT 'Hotel Photos', COUNT(*) FROM hotel_photo
-- UNION ALL
-- SELECT 'Hotel Packages', COUNT(*) FROM hotel_package
-- UNION ALL
-- SELECT 'Bookings', COUNT(*) FROM booking
-- UNION ALL
-- SELECT 'Discounts', COUNT(*) FROM discount;

-- SELECT 'Admin Users' as User_Type, COUNT(*) as Count FROM user WHERE role = 'ADMIN'
-- UNION ALL
-- SELECT 'Hotel Admins', COUNT(*) FROM user WHERE role = 'HOTEL_ADMIN'
-- UNION ALL
-- SELECT 'Regular Users', COUNT(*) FROM user WHERE role = 'USER';

-- SELECT h.name as Hotel_Name, u.first_name, u.last_name, u.email 
-- FROM hotel h 
-- LEFT JOIN user u ON h.hotel_id = u.hotel_id 
-- WHERE u.role = 'HOTEL_ADMIN'
-- ORDER BY h.name;

COMMIT;
