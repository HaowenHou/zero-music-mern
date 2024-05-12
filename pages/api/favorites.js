import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  // Get user's favorites
  if (method === "GET") {
    try {
      if (!req.query?.id) {
        return res.status(400).json({ error: "Missing user ID" });
      }
      const userId = req.query.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Switch a favorite of the user
  if (method === "POST") {
    try {
      if (!req.query?.id || !req.query?.userId) {
        return res.status(400).json({ error: "Missing user ID or track ID" });
      }
      const userId = req.query.userId;
      const trackId = req.query.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const index = user.favorites.indexOf(trackId);
      if (index === -1) {
        user.favorites.push(trackId);
      } else {
        user.favorites.splice(index, 1);
      }
      await user.save();
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}