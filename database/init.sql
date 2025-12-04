-- init.sql - PostgreSQL initialization script

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  user_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  role VARCHAR(50) DEFAULT 'User',
  country VARCHAR(100) NOT NULL,
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_country ON customers(country);

-- Insert sample data
INSERT INTO customers (name, country, user_count) VALUES
  ('ASM Technologies Ltd', 'India', 3),
  ('K&S', 'Singapore', 2),
  ('Global Systems', 'United States', 1),
  ('Innovation Labs', 'United Kingdom', 3),
  ('Digital Dynamics', 'Canada', 4);

-- Insert sample users
INSERT INTO users (customer_id, name, age, role, country, gender) VALUES
  (1, 'Amit Sharma', 30, 'Admin', 'India', 'Male'),
  (1, 'Priya Patel', 25, 'User', 'United States', 'Female'),
  (1, 'Rohit Kumar', 28, 'User', 'United Kingdom', 'Male'),
  (2, 'Meera Nair', 35, 'Admin', 'Singapore', 'Female'),
  (2, 'Daniel Tan', 32, 'User', 'Australia', 'Male'),
  (3, 'David Lee', 40, 'Admin', 'United States', 'Male'),
  (4, 'Emma Davis', 29, 'Admin', 'United Kingdom', 'Female'),
  (4, 'Frank Miller', 33, 'User', 'Germany', 'Male'),
  (4, 'Grace Taylor', 27, 'User', 'Canada', 'Female'),
  (5, 'Henry Wilson', 45, 'Admin', 'Canada', 'Male'),
  (5, 'Ivy Martinez', 38, 'User', 'Mexico', 'Female'),
  (5, 'Jack Anderson', 42, 'User', 'India', 'Male'),
  (5, 'Kavya Rao', 36, 'User', 'Canada', 'Female');