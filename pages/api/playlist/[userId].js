import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  const { method } = req;
  const { userId } = req.query;

  await dbConnect();

  if (method === 'GET') {
    try {
      const playlists = await User.findById(userId)
        .populate({
          path: 'playlists',
          populate: {
            path: 'userId',
            select: 'name'
          }
        })
        .populate({
          path: 'favoritePlaylists',
          populate: {
            path: 'userId',
            select: 'name'
          }
        })
        .select('playlists favoritePlaylists')
        .lean();

      // If query contains currentUid, check if each playlist in playlists is favorited by current user
      if (req.query.currentUid) {
        const currentUid = req.query.currentUid;
        const { favoritePlaylists: currentUserFavoritePlaylists } = await User.findById(currentUid).lean();
        playlists.playlists = playlists.playlists.map(playlist => {
          const isFavorited = currentUserFavoritePlaylists.includes(playlist._id);
          return { ...playlist, isFavorited };
        });
      }

      res.status(200).json(playlists);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}