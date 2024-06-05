import User from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;
  const userId = req.query?.uid;

  if (method === 'GET') {
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (req.query.populate) {
          await user.populate(populate);
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    }
  }
}