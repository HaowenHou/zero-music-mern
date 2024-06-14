import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

// Add track to favorites
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.body;
  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteTracks: trackId } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error favoriting track", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

// Remove track from favorites
router.delete('/:trackId', async (req, res) => {
  const userId = req.user.id;
  const { trackId } = req.params;
  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteTracks: trackId } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error unfavoriting track", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

export default router;
