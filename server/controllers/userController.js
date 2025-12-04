import User from '../models/User.js';

export async function getUsersByCustomerId(req, res) {
  const { id } = req.params;
  
  try {
    const users = await User.findByCustomerId(id);
    res.json(users);
  } catch (error) {
    console.error("Error in getUsersByCustomerId:", error);
    res.status(500).json({ error: 'Failed to fetch users' });

  }
}

export async function createUser(req, res) {
  try {
    if (req.params.id) {
        req.body.customer_id = req.params.id;
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUser(req, res) {
  const { customerId, id } = req.params;
  try {
    const user = await User.update(id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteUser(req, res) {
  const { customerId, id } = req.params;
  try {
    const user = await User.delete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}