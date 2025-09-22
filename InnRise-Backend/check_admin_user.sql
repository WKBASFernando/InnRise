-- Check if admin user exists
USE innRise;

SELECT 'Checking admin user...' as Status;

SELECT 
    email, 
    role, 
    first_name, 
    last_name,
    CASE 
        WHEN password IS NOT NULL AND password != '' THEN 'Password set'
        ELSE 'No password'
    END as password_status
FROM user 
WHERE email = 'angelofernando1609@gmail.com';

-- If user doesn't exist, create it
INSERT IGNORE INTO user (first_name, last_name, email, password, role, hotel_id) 
VALUES ('Angelo', 'Fernando', 'angelofernando1609@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN', NULL);

SELECT 'Admin user check/creation completed' as Status;
