import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { parseFile } from "music-metadata";
import Track from '../models/Track.js';
import Playlist from '../models/Playlist.js';
import dbConnect from '../utils/dbConnect.js';
import { isTrackFavoritedByUser } from '../utils/userUtils.js';

const router = express.Router();

// Middleware to handle formidable parsing
router.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      req.fields = fields;
      req.files = files;
      next();
    });
  } else {
    next();
  }
});

// GET a track by ID or all tracks
router.get('/', async (req, res) => {
  await dbConnect();
  const { id } = req.query;
  try {
    if (id) {
      const track = await Track.findById(id).lean();
      if (req.query.userId) {
        const favorite = await isTrackFavoritedByUser(req.query.userId, id);
        track.favorite = favorite;
      }
      res.status(200).json(track);
    } else {
      const tracks = await Track.find({}).lean();
      res.status(200).json(tracks);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new track or update an existing one
router.post('/', async (req, res) => {
  await dbConnect();
  const { fields, files } = req;
  const newName = `${fields.title[0]} - ${fields.artist[0]}`;

  let trackDuration = 0;
  let trackPath = '';
  let coverPath = '';

  // Handle file storage
  const storeFile = async (file, type) => {
    const uploadsDir = path.resolve(`./public/${type}`);
    const oldPath = file.filepath;
    const newPath = path.join(uploadsDir, newName + path.extname(file.originalFilename));
    const webPath = `/${type}/` + newName + path.extname(file.originalFilename);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);

    return {
      newPath,
      webPath
    };
  };

  // Process track file
  if (files.track) {
    const file = Array.isArray(files.track) ? files.track[0] : files.track;
    const result = await storeFile(file, 'tracks');
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
    const result = await storeFile(file, 'covers');
    coverPath = result.webPath;
  }

  const updateData = {
    title: fields.title[0],
    artist: fields.artist[0],
    duration: trackDuration,
    cover: coverPath || undefined,
    track: trackPath || undefined,
  };

  try {
    // Update or create new track
    if (fields.id) {
      const trackId = fields.id;
      const track = await Track.findByIdAndUpdate(trackId, updateData, { new: true });
      if (!track) {
        res.status(404).json({ error: 'Track not found' });
        return;
      }
      res.status(200).json({ message: 'Track updated', data: track });
    } else {
      const track = new Track(updateData);
      await track.save();
      // Optionally add the track to the global playlist
      await Playlist.updateOne({ title: 'Global' }, { $push: { tracks: track._id } });
      res.status(201).json({ message: 'Track created', data: track });
    }
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// DELETE a track
router.delete('/', async (req, res) => {
  await dbConnect();
  const { id } = req.query;
  try {
    const track = await Track.findById(id);
    // Delete associated files
    if (track.track) {
      fs.unlinkSync(path.resolve(`./public${track.track}`));
    }
    if (track.cover) {
      fs.unlinkSync(path.resolve(`./public${track.cover}`));
    }
    await Track.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: 'Track deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
