import User from '../models/User.js';

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

export const getUsersByCustomerId = async (req, res) => {
    const { customerId } = req.params;
    const users = await User.findByCustomerId(customerId);
    res.json(users);
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.update(id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.delete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
};