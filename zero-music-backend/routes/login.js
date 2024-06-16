import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyPassword } from '../utils/auth.js';
import 'dotenv/config'

const router = express.Router();

router.post('/', async (req, res) => {
  
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create a JWT
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role},
      process.env.JWT_SECRET_KEY, 
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    res.status(200).json({ 
      token,
      userId: user._id.toString(),
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

export default router;
