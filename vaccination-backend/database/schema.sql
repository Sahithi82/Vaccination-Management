-- Vaccination Center Training Database
-- Run this script in MySQL Workbench 8

CREATE DATABASE IF NOT EXISTS vaccination_db;
USE vaccination_db;

DROP TABLE IF EXISTS vaccinations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS centers;

CREATE TABLE centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    vaccine_name VARCHAR(50) NOT NULL,
    available_slots INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vaccinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    center_id INT NOT NULL,
    vaccine_name VARCHAR(50) NOT NULL,
    vaccination_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vaccination_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_vaccination_center
        FOREIGN KEY (center_id) REFERENCES centers(id)
);

INSERT INTO centers
(name, address, city, state, pin_code, contact_number, vaccine_name, available_slots, status)
VALUES
('Apollo Vaccination Center', 'Hitech City Road', 'Hyderabad', 'Telangana', '500072', '04011112222', 'Covishield', 50, 'ACTIVE'),
('City Care Center', 'Madhapur Main Road', 'Hyderabad', 'Telangana', '500072', '04022223333', 'Covaxin', 20, 'ACTIVE'),
('Sunshine Clinic', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', '04033334444', 'Covishield', 15, 'ACTIVE'),
('Closed Camp Center', 'Old City', 'Hyderabad', 'Telangana', '500002', '04044445555', 'Covaxin', 10, 'INACTIVE');

INSERT INTO users
(name, email, password, phone, pin_code)
VALUES
('Rahul', 'rahul@gmail.com', 'Rahul@123', '9876543210', '500072');
