import pool from '../config/database.js';

class User {
  static async findAll() {
    const query = `
      SELECT u.*, c.name as customer_name
      FROM users u
      JOIN customers c ON u.customer_id = c.id
      ORDER BY u.created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT u.*, c.name as customer_name
      FROM users u
      JOIN customers c ON u.customer_id = c.id
      WHERE u.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCustomerId(customerId) {
    const query = `
      SELECT * FROM users
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [customerId]);
    return result.rows;
  }

  static async create(userData) {
    const { customer_id, name, age, role, country, gender } = userData;
    
    const query = `
      INSERT INTO users (customer_id, name, age, role, country, gender)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [customer_id, name, age, role || 'User', country, gender];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email, role, status } = userData;
    
    const query = `
      UPDATE users
      SET name = $1, age = $2, role = $3, country = $4, gender = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [name, age, role, country, gender, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default User;