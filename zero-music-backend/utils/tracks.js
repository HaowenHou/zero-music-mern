import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

async function addFavoriteStatus(userId, tracks) {
  await dbConnect();
  const { favorites } = await User.findById(userId).lean();

  tracks = tracks.map(track => {
    const isFavorited = favorites.some(favoriteTrack => favoriteTrack.equals(track._id));
    return { ...track, isFavorited };
  });
  return tracks;
}

export { addFavoriteStatus };