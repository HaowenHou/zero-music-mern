import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cover: { type: String, required: false },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true }],
});

export default mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);