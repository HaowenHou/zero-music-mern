import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// GET posts from a user and their followees
router.get('/', async (req, res) => {
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId);
    const followingIds = user.following.map(id => new mongoose.Types.ObjectId(id));
    followingIds.push(user._id); // Include the user's own ID to fetch their posts too

    const posts = await Post.find({ userId: { $in: followingIds } })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .populate('userId', 'name avatar')
      .populate('trackId')
      .lean();
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Failed to retrieve posts:', error);
    res.status(400).json({ success: false, error: 'Failed to retrieve posts' });
  }
});

// POST a new post
router.post('/', async (req, res) => {
  const userId = req.user.id;
  
  try {
    const { content, trackId } = req.body;
    const post = new Post({
      userId,
      content,
      timestamp: new Date(), // Ensure the timestamp is set when creating a post
      trackId: trackId ? new mongoose.Types.ObjectId(trackId) : undefined
    });

    await post.save();
    
    // Add the post ID to the user's posts array
    await User.findByIdAndUpdate(userId, { $addToSet: { posts: post._id } });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error('Failed to create post:', error);
    res.status(400).json({ success: false, error: 'Failed to create post' });
  }
});

// DELETE a post
router.delete('/:postId', async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  
  try {
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete post:', error);
    res.status(400).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
