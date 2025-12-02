import pool from '../config/database.js';

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database initialization');
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(100),
        user_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Customers table created');

    await client.query(`
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
    `);
    console.log('Users table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);
    `);
    console.log('Indexes created');

    // Insert sample data
    const customerCheck = await client.query('SELECT COUNT(*) FROM customers');
    
    if (parseInt(customerCheck.rows[0].count) === 0) {
      console.log('Sample data');
      
    const customersResult = await client.query(`
      INSERT INTO customers (name, country, user_count)
      VALUES
        ('ASM Technologies Ltd', 'India', 3),
        ('K&S', 'Singapore', 2),
        ('Global Systems', 'United States', 1),
        ('Innovation Labs', 'United Kingdom', 3),
        ('Digital Dynamics', 'Canada', 4)
      RETURNING id;
    `);

      const customerIds = customersResult.rows.map(row => row.id);

    await client.query(`
      INSERT INTO users (customer_id, name, age, role, country, gender)
      VALUES 
        ($1, 'Amit Sharma', 30, 'Admin', 'India', 'Male'),
        ($1, 'Priya Patel', 25, 'User', 'United States', 'Female'),
        ($1, 'Rohit Kumar', 28, 'User', 'United Kingdom', 'Male'),
        ($2, 'Meera Nair', 35, 'Admin', 'Singapore', 'Female'),
        ($2, 'Daniel Tan', 32, 'User', 'Australia', 'Male'),
        ($3, 'David Lee', 40, 'Admin', 'United States', 'Male'),
        ($4, 'Emma Davis', 29, 'Admin', 'United Kingdom', 'Female'),
        ($4, 'Frank Miller', 33, 'User', 'Germany', 'Male'),
        ($4, 'Grace Taylor', 27, 'User', 'Canada', 'Female'),
        ($5, 'Henry Wilson', 45, 'Admin', 'Canada', 'Male'),
        ($5, 'Ivy Martinez', 38, 'User', 'Mexico', 'Female'),
        ($5, 'Jack Anderson', 42, 'User', 'India', 'Male'),
        ($5, 'Kavya Rao', 36, 'User', 'Canada', 'Female');
    `, [customerIds[0], customerIds[1], customerIds[2], customerIds[3], customerIds[4]]);

      console.log('Sample data inserted');
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createTables();