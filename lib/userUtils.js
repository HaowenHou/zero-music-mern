import User from '@/models/User';

export async function isTrackFavoritedByUser(userId, trackId) {
  try {
    const user = await User.findById(userId);
    return user && user.favorites.includes(trackId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}