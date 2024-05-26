import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover: { type: String, required: false },
  description: { type: String, required: false },
  // musics is array of ObjectId, and is required
  // musics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music", required: true }],
  tracks: [{ type: [String], required: true }],
});

export default mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);