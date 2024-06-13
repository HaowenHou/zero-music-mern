import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

// GET avatars for a user and their partner
router.get('/avatar/:userId', async (req, res) => {
  const { userId } = req.params;
  const { partnerId } = req.query;

  await dbConnect();

  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(partnerId);

    res.status(200).json({
      senderAvatar: sender ? sender.avatar : null,
      receiverAvatar: receiver ? receiver.avatar : null
    });
  } catch (error) {
    console.error('Failed to retrieve avatars:', error);
    res.status(400).json({ success: false, error: 'Failed to retrieve avatars' });
  }
});

// POST to follow or unfollow a user
router.post('/follow', async (req, res) => {
  const { userId, profileId } = req.body;

  await dbConnect();

  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isCurrentlyFollowing = currentUser.following && currentUser.following.includes(profileId);

    if (isCurrentlyFollowing) {
      await User.findByIdAndUpdate(userId, { $pull: { following: profileId } });
      res.status(200).json({ message: 'Unfollowed successfully', success: true });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { following: profileId } });
      res.status(200).json({ message: 'Followed successfully', success: true });
    }
  } catch (error) {
    console.error('Error updating follow status:', error);
    res.status(500).json({ success: false, error: 'Failed to update follow status' });
  }
});

// POST to check if a user is following another user
router.post('/isFollowing', async (req, res) => {
  const { userId, profileId } = req.body;

  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFollowing = user.following && user.following.includes(profileId);

    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ success: false, error: 'Failed to check follow status' });
  }
});

export default router;
