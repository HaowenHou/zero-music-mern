import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';
import bcrypt from 'bcryptjs';
import { addFavoriteStatus } from '../utils/tracks.js';
import { authenticateToken } from '../utils/auth.js';

const router = express.Router();

// Get user info. populate query can be used to populate fields
router.get('/:userId', authenticateToken, async (req, res) => {
  await dbConnect();
  let userId = req.params.userId;
  if (userId === 'current') {
    userId = req.user.id;
  }

  try {
    const user = await User.findById(userId);
    if (req.query.populate) {
      await user.populate(req.query.populate);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST to register a new user
router.post('/', async (req, res) => {
  await dbConnect();
  const { username, name, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    // const avatarPath = req.file ? `/avatars/${req.file.filename}` : undefined;

    const user = new User({
      username,
      name,
      password: hashedPassword,
      avatar: undefined || 'avatars/avatar_1.png',
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Get user's playlists
router.get('/:userId/playlists', async (req, res) => {
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

    // Check if each playlist in playlists is favorited by current user
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
router.get('/:userId/favoritePlaylists', async (req, res) => {
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
    let playlists = user.favoritePlaylists;

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

// Get user's favorite tracks
router.get('/:userId/favorites', async (req, res) => {
  await dbConnect();
  let userId = req.params.userId;
  if (userId === 'current') {
    userId = req.user.id;
  }

  try {
    const user = await User.findById(userId).populate('favorites').lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tracksWithFavoriteStatus = await addFavoriteStatus(userId, user.favorites);
    res.status(200).json(tracksWithFavoriteStatus);
  } catch (error) {
    console.error('Failed to retrieve favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
