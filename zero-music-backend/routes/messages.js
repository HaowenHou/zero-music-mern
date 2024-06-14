import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// GET all chat partners for a user
router.get('/', async (req, res) => {
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId).lean();
    const userAvatar = user.avatar;

    // Retrieve messages where the user is either the sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId', 'name avatar')
      .populate('receiverId', 'name avatar')
      .lean();

    // Reduce messages to a unique list of chat partners
    const uniqueChatPartners = new Set();
    const chatListData = [];

    messages.forEach(message => {
      const partner = message.senderId._id.toString() === userId ? message.receiverId : message.senderId;
      const partnerId = partner._id.toString();

      // If this partner hasn't been added yet, add them to the results
      if (!uniqueChatPartners.has(partnerId)) {
        uniqueChatPartners.add(partnerId);
        chatListData.push({
          partnerId,
          partnerName: partner.name,
          partnerAvatar: partner.avatar
        });
      }
    });

    res.status(200).json({ success: true, userAvatar, data: chatListData });
  } catch (error) {
    console.error('Error retrieving chat data:', error);
    res.status(400).json({ success: false, error: 'Failed to fetch chat data' });
  }
});

// GET all messages between two users
router.get('/:userId', async (req, res) => {
  const userId = req.user.id;
  const { userId: partnerId } = req.params;

  
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
