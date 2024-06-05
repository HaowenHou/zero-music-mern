import Post from "@/models/Post";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  if (method === "GET") {
    const { userId } = req.query;
    try {
      // Retrieve the user and their following list
      const user = await User.findById(userId);
      const followingIds = user.following;
      followingIds.push(user._id); // Include the user's own ID to fetch their posts too

      // Retrieve all posts from the user and their following users
      const posts = await Post.find({ userId: { $in: followingIds } })
        .sort({ timestamp: -1 }) // Sort by timestamp in descending order
        .populate('userId', 'name avatar')
        .populate('trackId')
        .exec();
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }

  if (method === "POST") {
    try {
      console.log(req.body);
      const trackId = req.body.trackId ? new mongoose.Types.ObjectId(req.body.trackId) : undefined;
      const post = await Post.create({ ...req.body, trackId });
      // put into user's posts
      const user = await User.findById(req.body.userId);
      // If posts is not an array, create it first
      if (!user.posts) {
        user.posts = [];
      }
      user.posts.push(post._id);
      await user.save();
      res.status(201).json({ success: true, data: post });

    } catch (error) {
      res.status(400).json({ success: false });
    }
  }

  if (method === "DELETE") {
    try {
      const { userId, postId } = req.query;
      await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}