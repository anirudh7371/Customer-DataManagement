import pool from '../config/database.js';

class Customer {
  static async findAll() {
    const query = `
      SELECT 
        c.*,
        COUNT(u.id) as user_count,
        COUNT(CASE WHEN u.status = 'Active' THEN 1 END) as active_user_count
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
      SELECT 
        c.*,
        COUNT(u.id) as user_count,
        COUNT(CASE WHEN u.status = 'Active' THEN 1 END) as active_user_count
      FROM customers c
      LEFT JOIN users u ON c.id = u.customer_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(customerData) {
    const { name, email, status, plan, mrr } = customerData;
    
    const query = `
      INSERT INTO customers (name, country, users_count)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [name, country, user_count];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, customerData) {
    const { name, email, status, plan, mrr } = customerData;
    
    const query = `
      UPDATE customers
      SET name = $1, country = $2, user_count = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const values = [name, country, user_count, id];
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