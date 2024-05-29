import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  const {
    query: { userId, partnerId },
    method,
  } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      }).sort({ timestamp: 1 }); // Sort by timestamp ascending
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}