import express from 'express';
import dbConnect from '../utils/dbConnect.js';
import Comment from '../models/Comment.js';
import Track from '../models/Track.js';

const router = express.Router();

// GET all comments for a track
router.get('/:trackId', async (req, res) => {
  const { trackId } = req.params;

  await dbConnect();

  try {
    const track = await Track
      .findById(trackId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: '_id name avatar'
        }
      })
      .exec();
    res.status(200).json(track.comments || []);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment to a track
router.post('/:trackId', async (req, res) => {
  const { trackId } = req.params;
  const { userId, content, timestamp } = req.body;

  await dbConnect();

  try {
    const comment = new Comment({
      userId,
      content,
      timestamp,
      trackId
    });
    await comment.save();
    await Track.findByIdAndUpdate(trackId, { $addToSet: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to post comment:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
