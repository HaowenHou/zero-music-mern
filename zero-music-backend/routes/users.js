import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import bcrypt from 'bcryptjs';
import { addFavoriteStatus } from '../utils/tracks.js';
import { authenticateToken } from '../utils/auth.js';
import { handleFormidable, storeFile } from '../utils/file.js';

const router = express.Router();

// Get user info. populate query can be used to populate fields
router.get('/:userId', authenticateToken, async (req, res) => {
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
router.post('/', handleFormidable, async (req, res) => {
  const { fields, files } = req;
  const username = fields.username[0];
  const password = fields.password[0];
  const name = fields.name[0];
  const useDefaultAvatar = fields.useDefaultAvatar[0] === 'true';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let avatarPath = undefined;
    if (files.avatar) {
      const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
      const result = await storeFile(file, 'avatars', username);
      avatarPath = result.webPath;
    }

    if (useDefaultAvatar) {
      avatarPath = '/assets/default-avatar-s.png';
    }
    const user = new User({
      username,
      name,
      password: hashedPassword,
      avatar: avatarPath,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// PUT to update user info
router.put('/', [authenticateToken, handleFormidable], async (req, res) => {
  const userId = req.user.id;
  const { fields, files } = req;
  const username = fields.username[0];
  const password = fields.password[0];
  const name = fields.name[0];
  const useDefaultAvatar = fields.useDefaultAvatar[0] === 'true';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let avatarPath = undefined;
    if (files.avatar) {
      const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
      const result = await storeFile(file, 'avatars', username);
      avatarPath = result.webPath;
    }

    if (useDefaultAvatar) {
      avatarPath = '/assets/default-avatar-s.png';
    }
    
    await User.findByIdAndUpdate(userId, {
      username,
      name,
      password: hashedPassword,
      avatar: avatarPath,
    })

    // Also return updated user info
    res.status(200).json({ 
      message: 'User updated successfully!',
      user: {
        username,
        name,
        avatar: avatarPath,
      }
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// Get user's playlists
router.get('/:userId/playlists', authenticateToken, async (req, res) => {
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
router.get('/:userId/favoritePlaylists', authenticateToken, async (req, res) => {
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
router.get('/:userId/favorites', authenticateToken, async (req, res) => {
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

// POST to follow a user
router.post('/:userId/follow', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  const userIdToFollow = req.params.userId;

  try {
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userIdToFollow } });
    await User.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: currentUserId } });
    res.status(200).json({ message: 'Followed successfully', success: true });
  } catch (error) {
    console.error('Error updating follow status:', error);
    res.status(500).json({ success: false, error: 'Failed to update follow status' });
  }
});

// DELETE to unfollow a user
router.delete('/:userId/follow', authenticateToken, async (req, res) => {
  const currentUserId = req.user.id;
  const userIdToUnfollow = req.params.userId;

  try {
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: userIdToUnfollow } });
    await User.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: currentUserId } });
    res.status(200).json({ message: 'Unfollowed successfully', success: true });
  } catch (error) {
    console.error('Error updating follow status:', error);
    res.status(500).json({ success: false, error: 'Failed to update follow status' });
  }
});

// GET user's following list
router.get('/:userId/following', async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('following').lean();
    res.status(200).json(user.following);
  } catch (error) {
    console.error('Failed to retrieve following list:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET user's posts
router.get('/:userId/posts', async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ userId: userId })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .populate('userId', 'name avatar')
      .populate('trackId')
      .lean();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Failed to retrieve posts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
