import express from 'express';
import dbConnect from '../utils/dbConnect.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET all messages between two users
router.get('/:userId', async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.query;

  await dbConnect();

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId }
      ]
    }).sort({ timestamp: 1 }); // Sort by timestamp ascending
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Failed to retrieve messages:', error);
    res.status(400).json({ success: false, error: 'Failed to retrieve messages' });
  }
});

export default router;
