import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import Track from "@/models/Track";

export default async function handler(req, res) {
  await dbConnect();
  
  const { method } = req;
  const { trackId } = req.query;

  if (method === 'GET') {
    try {
      const comments = await Track
      .findById(trackId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: '_id name avatar'
        }
      })
      .exec();
      res.status(200).json(comments.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  if (method === 'POST') {
    const { userId, content, timestamp } = req.body;

    try {
      const comment = new Comment({ userId, content, timestamp, trackId });
      await comment.save();
      await Track.findByIdAndUpdate(trackId, { $addToSet: { comments: comment._id } });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}