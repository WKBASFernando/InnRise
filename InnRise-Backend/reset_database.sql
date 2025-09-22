-- ==================== DATABASE RESET SCRIPT ====================
-- This script drops and recreates the innRise database
-- Run this before starting the application to get fresh tables

-- Drop the database if it exists
DROP DATABASE IF EXISTS innRise;

-- Create the database
CREATE DATABASE innRise;

-- Use the database
USE innRise;

-- Note: Tables will be created automatically by Hibernate when you start the application
-- After the application starts and creates the tables, run the sample_data.sql script
