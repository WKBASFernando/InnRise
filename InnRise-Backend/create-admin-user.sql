-- Create admin user
INSERT INTO user (first_name, last_name, email, password, role) 
VALUES (
    'Angelo', 
    'Fernando', 
    'angelofernando1609@gmail.com', 
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- password123
    'ADMIN'
) ON DUPLICATE KEY UPDATE 
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    password = VALUES(password),
    role = VALUES(role);

-- Create a test hotel
INSERT INTO hotel (name, location, address, contact_number, email, description, star_rating, price)
VALUES (
    'Test Hotel',
    'Colombo',
    '123 Test Street, Colombo',
    '011-123-4567',
    'test@hotel.com',
    'A beautiful test hotel in Colombo',
    5,
    15000.00
) ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    location = VALUES(location),
    address = VALUES(address),
    contact_number = VALUES(contact_number),
    email = VALUES(email),
    description = VALUES(description),
    star_rating = VALUES(star_rating),
    price = VALUES(price);

-- Create a test room
INSERT INTO room (hotel_id, type, price)
VALUES (
    (SELECT hotel_id FROM hotel WHERE name = 'Test Hotel' LIMIT 1),
    'Standard Room',
    15000.00
) ON DUPLICATE KEY UPDATE
    type = VALUES(type),
    price = VALUES(price);

-- Create a test discount
INSERT INTO discount (name, code, percentage, valid_from, valid_to, description)
VALUES (
    'Early Bird Discount',
    'EARLY20',
    20.0,
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'Get 20% off for early bookings'
) ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    code = VALUES(code),
    percentage = VALUES(percentage),
    valid_from = VALUES(valid_from),
    valid_to = VALUES(valid_to),
    description = VALUES(description);
