import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false }, // URL to the image in the /public/avatars directory
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }], // Array of track IDs
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }], // Array of playlist IDs
  favoritePlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  role: { type: String, required: true, default: 'user' }, // 'user' or 'admin'
  drive: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTrack' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: String, required: false },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

export default mongoose.models.User || mongoose.model('User', userSchema);
