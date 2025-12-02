import User from '../models/User.js';

export async function getUsersByCustomerId(req, res) {
  const { customerId } = req.params;
  const users = await User.findByCustomerId(customerId);
  res.json(users);
}

export async function createUser(req, res) {
  const user = await User.create(req.body);
  res.status(201).json(user);
}
export async function updateUser(req, res) {
  const { id } = req.params;
  const user = await User.update(id, req.body);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.delete(id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ message: 'User deleted successfully' });
}