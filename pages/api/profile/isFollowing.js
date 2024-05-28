import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  
  if (method === 'POST') {
    const { userId, profileId } = req.body;

    const user = await User.findOne({ _id: userId }).exec();

    const isFollowing = user.following && user.following.includes(profileId);

    res.status(200).json({ isFollowing });
  }
}