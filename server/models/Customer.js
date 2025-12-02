import pool from '../config/database.js';

class Customer {
  static async findAll() {
    const query = `
      SELECT 
        c.id, 
        c.name, 
        c.country, 
        c.created_at,
        COUNT(u.id)::int as user_count
      FROM customers c
      LEFT JOIN users u ON c.id = u.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT * FROM customers WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(customerData) {
    const { name, country } = customerData;
    
    const query = `
      INSERT INTO customers (name, country, user_count)
      VALUES ($1, $2, 0)
      RETURNING *
    `;
    
    const values = [name, country];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, customerData) {
    const { name, country } = customerData;
    
    const query = `
      UPDATE customers
      SET name = $1, country = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const values = [name, country, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default Customer;