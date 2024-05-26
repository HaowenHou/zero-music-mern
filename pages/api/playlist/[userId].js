import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Playlist from '@/models/Playlist';

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;

  await dbConnect();

  if (method === 'GET') {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const playlists = await Playlist.find({
        '_id': { $in: user.playlists }
      }).exec();
      res.status(200).json(playlists);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}