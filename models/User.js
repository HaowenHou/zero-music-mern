import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false }, // URL to the image in the /public/avatars directory
  favorites: { type: [String], required: false }, // Array of track IDs
  playlists: { type: [String], required: false }, // Array of playlist IDs
  role: { type: String, required: true, default: 'user' }, // 'user' or 'admin'
  drive: { type: [String], required: false },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
