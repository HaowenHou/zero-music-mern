import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  music: { type: mongoose.Schema.Types.ObjectId, ref: 'Music', required: true }
});

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
