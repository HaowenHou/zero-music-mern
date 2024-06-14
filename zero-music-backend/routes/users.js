import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Get user's playlists
router.get('/:userId/playlists', authenticateToken, async (req, res) => {
  await dbConnect();
  let userId = req.params.userId;
  if (userId === 'current') {
    userId = req.user.id;
  }

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'playlists',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .lean();
    let playlists = user.playlists;

    // If query contains currentUid, check if each playlist in playlists is favorited by current user
    if (userId !== 'current') {
      const currentUid = req.user.id;
      const { favoritePlaylists: currentUserFavoritePlaylists } = await User.findById(currentUid).lean();
      playlists = playlists.map(playlist => {
        const isFavorited = currentUserFavoritePlaylists.includes(playlist._id);
        return { ...playlist, isFavorited };
      });
    }
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's favorite playlists
router.get('/:userId/favoritePlaylists', authenticateToken, async (req, res) => {
  await dbConnect();
  let userId = req.params.userId;
  if (userId === 'current') {
    userId = req.user.id;
  }

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'favoritePlaylists',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .lean();
    let playlists = user.playlists;

    // If query contains currentUid, check if each playlist in playlists is favorited by current user
    if (userId !== 'current') {
      const currentUid = req.user.id;
      const { favoritePlaylists: currentUserFavoritePlaylists } = await User.findById(currentUid).lean();
      playlists = playlists.map(playlist => {
        const isFavorited = currentUserFavoritePlaylists.includes(playlist._id);
        return { ...playlist, isFavorited };
      });
    }
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
