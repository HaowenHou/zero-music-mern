import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // musics is array of ObjectId, and is required
  // musics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Music", required: true }],
  musics: [{ type: [String], required: true }],
});

export default mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);