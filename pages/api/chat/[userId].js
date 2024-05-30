import User from '@/models/User';
import Message from '@/models/Message';

export default async function handler(req, res) {
  const { query: { userId }, method } = req;

  if (method === 'GET') {
    try {
      const user = await User.findById(userId).exec();
      const userAvatar = user.avatar;

      // Retrieve messages where the user is either the sender or receiver
      const messages = await Message.find({
        $or: [{ senderId: userId }, { receiverId: userId }]
      }).populate('senderId', 'name avatar')
        .populate('receiverId', 'name avatar')
        .exec();

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
            partnerId: partnerId,
            partnerName: partner.name,
            partnerAvatar: partner.avatar
          });
        }
      });

      res.status(200).json({ success: true, userAvatar: userAvatar, data: chatListData });

    } catch (err) {
      res.status(400).json({ success: false });
    }
  }
}