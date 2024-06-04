import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    try {
      const { userId, playlistId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.favoritePlaylists.includes(playlistId)) {
        await User.findByIdAndUpdate(userId, {
          $pull: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
        });
      } else {
        await User.findByIdAndUpdate(userId, {
          $push: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
        });
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error favoriting playlist", error);
      res.status(500).json({ error: "Database operation failed" });
    }
  }

  if (method === "DELETE") {
    try {
      const { userId, playlistId } = req.query;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await User.findByIdAndUpdate(userId, {
        $pull: { favoritePlaylists: playlistId },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error unfavoriting playlist", error);
      res.status(500).json({ error: "Database operation failed" });
    }
  }
}