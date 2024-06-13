import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { id: userId } = req.query;

  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Failed to retrieve favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:userId/:trackId', async (req, res) => {
  const { userId, trackId } = req.params;

  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const index = user.favorites.indexOf(trackId);
    if (index === -1) {
      user.favorites.push(trackId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
