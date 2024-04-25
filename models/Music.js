import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  // length: { type: Number, required: true }, // length in seconds
  cover: { type: String, required: true } // URL to the cover image
});

export default mongoose.models.Music || mongoose.model('Music', musicSchema);
