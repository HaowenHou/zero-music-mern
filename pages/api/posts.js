import Post from "@/models/Post";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const posts = await Post.find().populate("userId trackId");
      res.status(200).json(posts);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}