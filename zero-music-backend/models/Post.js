import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: false }
});

export default mongoose.models.Post || mongoose.model('Post', postSchema);