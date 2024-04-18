import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false } // URL to the image in the /public/avatars directory
});

export default mongoose.models.User || mongoose.model('User', userSchema);
