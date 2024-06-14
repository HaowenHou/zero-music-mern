import User from '../models/User.js';
import Message from '../models/Message.js';

async function isTrackFavoritedByUser(userId, trackId) {
  try {
    const user = await User.findById(userId);
    return user && user.favorites.includes(trackId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

async function sendMessage(senderId, receiverId, text) {
  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message: text
    });

    await newMessage.save();
  } catch (error) {
    console.error('Error saving the message:', error);
  }
}

export { isTrackFavoritedByUser, sendMessage };