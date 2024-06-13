import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
});

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);