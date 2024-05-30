import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { userId, partnerId },
    method,
  } = req;

  if (method === 'GET') {
    try {
      const sender = await User.findById(userId);
      const receiver = await User.findById(partnerId);

      res.status(200).json({
        senderAvatar: sender.avatar,
        receiverAvatar: receiver.avatar
      });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } 
}