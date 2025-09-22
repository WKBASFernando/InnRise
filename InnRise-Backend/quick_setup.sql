-- Quick Database Setup for InnRise
-- Run this if you just want the essential tables and sample data

USE innRise;

-- Insert sample hotels (assuming tables already exist) - Prices in LKR
INSERT INTO hotel (name, location, address, contact_number, email, description, star_rating, price) VALUES
('Sunset Paradise Hotel', 'Colombo', '123 Galle Road, Colombo 03', '+94 77 123 4567', 'info@sunsetparadise.com', 'A luxurious beachfront hotel with stunning ocean views and world-class amenities.', 5, 75000.00),
('Mountain View Resort', 'Kandy', '456 Peradeniya Road, Kandy', '+94 81 234 5678', 'reservations@mountainview.com', 'Nestled in the hills of Kandy, offering panoramic views and serene surroundings.', 4, 54000.00),
('City Center Hotel', 'Colombo', '789 Union Place, Colombo 02', '+94 11 345 6789', 'bookings@citycenter.com', 'Modern hotel in the heart of Colombo with easy access to business districts.', 4, 60000.00),
('Beachfront Villa', 'Galle', '321 Unawatuna Road, Galle', '+94 91 456 7890', 'info@beachfrontvilla.com', 'Exclusive beachfront property with private beach access and luxury amenities.', 5, 105000.00),
('Heritage Inn', 'Anuradhapura', '654 Sacred City Road, Anuradhapura', '+94 25 567 8901', 'stay@heritageinn.com', 'Historic hotel near ancient temples, offering cultural experiences.', 3, 36000.00),
('Tropical Resort', 'Negombo', '987 Beach Road, Negombo', '+94 31 678 9012', 'resort@tropical.com', 'Family-friendly resort with water sports and entertainment facilities.', 4, 48000.00),
('Business Hotel', 'Colombo', '147 Independence Avenue, Colombo 07', '+94 11 789 0123', 'business@hotel.com', 'Executive hotel designed for business travelers with meeting facilities.', 4, 66000.00),
('Garden Hotel', 'Nuwara Eliya', '258 Gregory Lake Road, Nuwara Eliya', '+94 52 890 1234', 'garden@hotel.com', 'Charming hotel surrounded by tea plantations and cool mountain air.', 3, 42000.00),
('Luxury Suites', 'Colombo', '369 Marine Drive, Colombo 03', '+94 11 901 2345', 'luxury@suites.com', 'Premium accommodation with personalized service and exclusive amenities.', 5, 120000.00),
('Budget Inn', 'Colombo', '741 Pettah Market, Colombo 11', '+94 11 012 3456', 'budget@inn.com', 'Affordable accommodation in the bustling market area.', 2, 24000.00),
('Seaside Hotel', 'Trincomalee', '852 Nilaveli Beach, Trincomalee', '+94 26 123 4567', 'seaside@hotel.com', 'Beachfront hotel with diving and water sports activities.', 4, 57000.00);

-- Insert hotel photos
INSERT INTO hotel_photo (hotel_id, url) VALUES
(1, '/images/1.jpg'),
(2, '/images/2.jpg'),
(3, '/images/3.jpg'),
(4, '/images/4.jpg'),
(5, '/images/5.jpg'),
(6, '/images/6.jpg'),
(7, '/images/7.jpg'),
(8, '/images/8.jpg'),
(9, '/images/9.jpg'),
(10, '/images/10.jpg'),
(11, '/images/11.jpg');

-- Insert rooms (Prices in LKR)
INSERT INTO room (hotel_id, type, price) VALUES
(1, 'Deluxe Ocean View', 75000.00),
(1, 'Standard Room', 60000.00),
(2, 'Mountain View Room', 54000.00),
(2, 'Standard Room', 45000.00),
(3, 'Executive Room', 60000.00),
(3, 'Standard Room', 50000.00),
(4, 'Beachfront Villa', 105000.00),
(5, 'Heritage Room', 36000.00),
(6, 'Family Room', 48000.00),
(7, 'Business Suite', 66000.00),
(8, 'Garden View Room', 42000.00),
(9, 'Luxury Suite', 120000.00),
(10, 'Budget Room', 24000.00),
(11, 'Beach View Room', 57000.00);

SELECT 'Sample data inserted successfully!' as Status;
SELECT COUNT(*) as 'Total Hotels' FROM hotel;
