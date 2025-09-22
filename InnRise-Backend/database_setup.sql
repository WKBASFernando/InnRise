-- InnRise Database Setup Script
-- Run this script to create the database and populate it with sample data

-- Create database
CREATE DATABASE IF NOT EXISTS innRise;
USE innRise;

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS hotel_photo;
DROP TABLE IF EXISTS hotel_package;
DROP TABLE IF EXISTS hotel;
DROP TABLE IF EXISTS discount;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS refresh_token;

-- Create User table
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create RefreshToken table
CREATE TABLE refresh_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create Discount table
CREATE TABLE discount (
    discount_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    percentage DECIMAL(5,2) NOT NULL
);

-- Create Hotel table
CREATE TABLE hotel (
    hotel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    description TEXT,
    star_rating INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    discount_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (discount_id) REFERENCES discount(discount_id) ON DELETE SET NULL
);

-- Create HotelPhoto table
CREATE TABLE hotel_photo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE
);

-- Create Room table
CREATE TABLE room (
    room_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE
);

-- Create HotelPackage table
CREATE TABLE hotel_package (
    package_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hotel_id BIGINT NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE
);

-- Create Booking table
CREATE TABLE booking (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    hotel_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT NOT NULL,
    number_of_rooms INT NOT NULL,
    special_requests TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE
);

-- Create Payment table
CREATE TABLE payment (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER') NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

-- Create Feedback table
CREATE TABLE feedback (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert Users
INSERT INTO user (first_name, last_name, email, password, role) VALUES
('John', 'Doe', 'john.doe@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER'),
('Jane', 'Smith', 'jane.smith@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'USER'),
('Admin', 'User', 'admin@innrise.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN');

-- Insert Discounts
INSERT INTO discount (code, percentage) VALUES
('WELCOME10', 10.00),
('SUMMER20', 20.00),
('EARLYBIRD15', 15.00),
('LOYALTY25', 25.00);

-- Insert Hotels (Prices in LKR)
INSERT INTO hotel (name, location, address, contact_number, email, description, star_rating, price, discount_id) VALUES
('Sunset Paradise Hotel', 'Colombo', '123 Galle Road, Colombo 03', '+94 77 123 4567', 'info@sunsetparadise.com', 'A luxurious beachfront hotel with stunning ocean views and world-class amenities.', 5, 75000.00, 1),
('Mountain View Resort', 'Kandy', '456 Peradeniya Road, Kandy', '+94 81 234 5678', 'reservations@mountainview.com', 'Nestled in the hills of Kandy, offering panoramic views and serene surroundings.', 4, 54000.00, 2),
('City Center Hotel', 'Colombo', '789 Union Place, Colombo 02', '+94 11 345 6789', 'bookings@citycenter.com', 'Modern hotel in the heart of Colombo with easy access to business districts.', 4, 60000.00, 1),
('Beachfront Villa', 'Galle', '321 Unawatuna Road, Galle', '+94 91 456 7890', 'info@beachfrontvilla.com', 'Exclusive beachfront property with private beach access and luxury amenities.', 5, 105000.00, 3),
('Heritage Inn', 'Anuradhapura', '654 Sacred City Road, Anuradhapura', '+94 25 567 8901', 'stay@heritageinn.com', 'Historic hotel near ancient temples, offering cultural experiences.', 3, 36000.00, 4),
('Tropical Resort', 'Negombo', '987 Beach Road, Negombo', '+94 31 678 9012', 'resort@tropical.com', 'Family-friendly resort with water sports and entertainment facilities.', 4, 48000.00, 2),
('Business Hotel', 'Colombo', '147 Independence Avenue, Colombo 07', '+94 11 789 0123', 'business@hotel.com', 'Executive hotel designed for business travelers with meeting facilities.', 4, 66000.00, 1),
('Garden Hotel', 'Nuwara Eliya', '258 Gregory Lake Road, Nuwara Eliya', '+94 52 890 1234', 'garden@hotel.com', 'Charming hotel surrounded by tea plantations and cool mountain air.', 3, 42000.00, 3),
('Luxury Suites', 'Colombo', '369 Marine Drive, Colombo 03', '+94 11 901 2345', 'luxury@suites.com', 'Premium accommodation with personalized service and exclusive amenities.', 5, 120000.00, 4),
('Budget Inn', 'Colombo', '741 Pettah Market, Colombo 11', '+94 11 012 3456', 'budget@inn.com', 'Affordable accommodation in the bustling market area.', 2, 24000.00, 1),
('Seaside Hotel', 'Trincomalee', '852 Nilaveli Beach, Trincomalee', '+94 26 123 4567', 'seaside@hotel.com', 'Beachfront hotel with diving and water sports activities.', 4, 57000.00, 2);

-- Insert Hotel Photos
INSERT INTO hotel_photo (hotel_id, url) VALUES
(1, '/images/1.jpg'),
(1, '/images/2.jpg'),
(2, '/images/3.jpg'),
(2, '/images/4.jpg'),
(3, '/images/5.jpg'),
(3, '/images/6.jpg'),
(4, '/images/7.jpg'),
(4, '/images/8.jpg'),
(5, '/images/9.jpg'),
(5, '/images/10.jpg'),
(6, '/images/11.jpg'),
(7, '/images/1.jpg'),
(8, '/images/2.jpg'),
(9, '/images/3.jpg'),
(10, '/images/4.jpg'),
(11, '/images/5.jpg');

-- Insert Rooms (Prices in LKR)
INSERT INTO room (hotel_id, type, price) VALUES
(1, 'Deluxe Ocean View', 75000.00),
(1, 'Standard Room', 60000.00),
(1, 'Presidential Suite', 120000.00),
(2, 'Mountain View Room', 54000.00),
(2, 'Standard Room', 45000.00),
(3, 'Executive Room', 60000.00),
(3, 'Standard Room', 50000.00),
(4, 'Beachfront Villa', 105000.00),
(4, 'Garden Villa', 85000.00),
(5, 'Heritage Room', 36000.00),
(6, 'Family Room', 48000.00),
(6, 'Standard Room', 40000.00),
(7, 'Business Suite', 66000.00),
(7, 'Executive Room', 55000.00),
(8, 'Garden View Room', 42000.00),
(9, 'Luxury Suite', 120000.00),
(10, 'Budget Room', 24000.00),
(11, 'Beach View Room', 57000.00);

-- Insert Hotel Packages (Prices in LKR)
INSERT INTO hotel_package (hotel_id, package_name, description, price) VALUES
(1, 'Romantic Getaway', '2 nights with dinner and spa treatment', 180000.00),
(1, 'Family Package', '3 nights with breakfast and kids activities', 240000.00),
(2, 'Adventure Package', '2 nights with hiking and sightseeing tours', 135000.00),
(4, 'Luxury Beach Package', '3 nights with all meals and water sports', 360000.00),
(6, 'Family Fun Package', '2 nights with entertainment and meals', 120000.00);

-- Insert Sample Bookings (Amounts in LKR)
INSERT INTO booking (user_id, hotel_id, check_in_date, check_out_date, number_of_guests, number_of_rooms, special_requests, total_amount, status) VALUES
(1, 1, '2024-02-15', '2024-02-17', 2, 1, 'Late check-in requested', 150000.00, 'CONFIRMED'),
(2, 2, '2024-02-20', '2024-02-22', 2, 1, 'Vegetarian meals preferred', 108000.00, 'CONFIRMED'),
(1, 4, '2024-03-01', '2024-03-04', 4, 2, 'Anniversary celebration', 315000.00, 'PENDING'),
(2, 6, '2024-03-10', '2024-03-12', 3, 1, 'Family with young children', 96000.00, 'CONFIRMED');

-- Insert Sample Payments (Amounts in LKR)
INSERT INTO payment (booking_id, amount, payment_method, payment_status, transaction_id) VALUES
(1, 150000.00, 'CREDIT_CARD', 'COMPLETED', 'TXN001234567'),
(2, 108000.00, 'DEBIT_CARD', 'COMPLETED', 'TXN001234568'),
(4, 96000.00, 'CREDIT_CARD', 'COMPLETED', 'TXN001234569');

-- Insert Sample Feedback
INSERT INTO feedback (booking_id, rating, comment) VALUES
(1, 5, 'Excellent service and beautiful ocean view. Highly recommended!'),
(2, 4, 'Great location and friendly staff. Room was clean and comfortable.'),
(4, 5, 'Perfect for families. Kids loved the activities and pool.');

-- Create indexes for better performance
CREATE INDEX idx_hotel_location ON hotel(location);
CREATE INDEX idx_hotel_star_rating ON hotel(star_rating);
CREATE INDEX idx_hotel_price ON hotel(price);
CREATE INDEX idx_booking_user_id ON booking(user_id);
CREATE INDEX idx_booking_hotel_id ON booking(hotel_id);
CREATE INDEX idx_booking_check_in ON booking(check_in_date);
CREATE INDEX idx_booking_status ON booking(status);

-- Show summary
SELECT 'Database setup completed successfully!' as Status;
SELECT COUNT(*) as 'Total Hotels' FROM hotel;
SELECT COUNT(*) as 'Total Users' FROM user;
SELECT COUNT(*) as 'Total Bookings' FROM booking;
