import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in seconds
  cover: { type: String, required: true }, // URL to the cover image
  track: { type: String, required: true } // URL to the track file
});

export default mongoose.models.Track || mongoose.model('Track', trackSchema);
