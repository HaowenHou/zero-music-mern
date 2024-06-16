import express from 'express';
import { parseFile } from 'music-metadata';
import User from '../models/User.js';
import UserTrack from '../models/UserTrack.js';
import { handleFormidable, storeFile } from '../utils/file.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId).populate("drive");
    const driveTracks = user.drive || [];
    res.status(200).json(driveTracks);
  } catch (error) {
    console.error('Failed to retrieve drive tracks:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve drive tracks' });
  }
});

// GET a track by ID
router.get('/:trackId?', async (req, res) => {
  const { trackId } = req.params;
  try {
    if (trackId) {
      const track = await UserTrack.findById(trackId).lean();
      res.status(200).json(track);
    } else {
      const tracks = await UserTrack.find({}).lean();
      res.status(200).json(tracks);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:trackId', async (req, res) => {
  const { trackId } = req.params;
  const userId = req.user.id;
  
  try {
    await UserTrack.findByIdAndDelete(trackId);
    await User.findByIdAndUpdate(userId, { $pull: { drive: trackId } });
    res.status(200).json({ success: true, message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Failed to delete track:', error);
    res.status(500).json({ success: false, error: 'Failed to delete track' });
  }
});

router.post('/', handleFormidable, async (req, res) => {
  const userId = req.user.id;
    const { fields, files } = req;
  const title = fields.title[0];
  const artist = fields.artist[0];
  const newFilename = `${userId} - ${title} - ${artist}`;

  let trackDuration = 0;
  let trackPath = '';
  let coverPath = '';

  // Process track file
  if (files.track) {
    const file = Array.isArray(files.track) ? files.track[0] : files.track;
    const result = await storeFile(file, 'driveTracks', newFilename);
    trackPath = result.webPath;

    // Read music metadata
    try {
      const metadata = await parseFile(result.newPath);
      trackDuration = Math.round(metadata.format.duration);
    } catch (error) {
      console.error('Error reading metadata', error);
      res.status(500).json({ error: 'Failed to read file metadata' });
      return;
    }
  }

  // Process cover file
  if (files.cover) {
    const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
    const result = await storeFile(file, 'driveCovers', newFilename);
    coverPath = result.webPath;
  }

  const updateData = {
    title: title,
    artist: artist,
    duration: trackDuration > 0 ? trackDuration : undefined,
    cover: coverPath || undefined,
    track: trackPath || undefined,
  };

  try {
    const track = new UserTrack(updateData);
    await track.save();
    await User.findByIdAndUpdate(userId, { $addToSet: { drive: track._id } });
    res.status(201).json({ message: 'Track created', data: track });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// PUT update a track
router.put('/:trackId', handleFormidable, async (req, res) => {
  const { trackId } = req.params;
  const { fields, files } = req;
  const title = fields.title[0];
  const artist = fields.artist[0];
  const newFilename = `${title} - ${artist}`;

  let trackDuration = 0;
  let trackPath = '';
  let coverPath = '';

  // Process track file
  if (files.track) {
    const file = Array.isArray(files.track) ? files.track[0] : files.track;
    const result = await storeFile(file, 'driveTracks', newFilename);
    trackPath = result.webPath;

    // Read music metadata
    try {
      const metadata = await parseFile(result.newPath);
      trackDuration = Math.round(metadata.format.duration);
    } catch (error) {
      console.error('Error reading metadata', error);
      res.status(500).json({ error: 'Failed to read file metadata' });
      return;
    }
  }

  // Process cover file
  if (files.cover) {
    const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
    const result = await storeFile(file, 'driveCovers', newFilename);
    coverPath = result.webPath;
  }

  const updateData = {
    title: title,
    artist: artist,
    duration: trackDuration,
    cover: coverPath || undefined,
    track: trackPath || undefined,
  };

  try {
    const track = await UserTrack.findByIdAndUpdate(trackId, updateData, { new: true });
    res.status(200).json({ message: 'Track updated', data: track });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

export default router;
