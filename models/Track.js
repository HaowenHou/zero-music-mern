import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in seconds
  cover: { type: String, required: true }, // URL to the cover image
  track: { type: String, required: true }, // URL to the track file
  lyrics: [{ type: String }], // Array of strings, each representing a line in the lyrics
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.models.Track || mongoose.model('Track', trackSchema);
