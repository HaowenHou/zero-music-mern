import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in seconds
  cover: { type: String, required: true }, // URL to the cover image
  track: { type: String, required: true } // URL to the music file
});

export default mongoose.models.Music || mongoose.model('Music', musicSchema);
