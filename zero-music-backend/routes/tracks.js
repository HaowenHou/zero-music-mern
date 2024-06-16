import express from 'express';
import fs from 'fs';
import path from 'path';
import { parseFile } from "music-metadata";
import Track from '../models/Track.js';
import Comment from '../models/Comment.js';
import { handleFormidable, storeFile } from '../utils/file.js';
import { authenticateToken, isAdmin } from '../utils/auth.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { addFavoriteStatus } from '../utils/tracks.js';

const router = express.Router();

// GET all tracks
router.get('/', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    const secretKey = process.env.JWT_SECRET_KEY;
    jwt.verify(token, secretKey, (err, user) => {
      req.user = user;
    });
  }
  const userId = req.user?.id;
  let globalPlaylist = await Track.find().lean();
  if (userId) {
    globalPlaylist = await addFavoriteStatus(userId, globalPlaylist);
  }
  res.status(200).json(globalPlaylist);
});

// GET a track by ID or all tracks
router.get('/:trackId?', async (req, res) => {
  const { trackId } = req.params;
  try {
    if (trackId) {
      const track = await Track.findById(trackId).lean();
      res.status(200).json(track);
    } else {
      const tracks = await Track.find({}).lean();
      res.status(200).json(tracks);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new track
router.post('/', [authenticateToken, isAdmin, handleFormidable], async (req, res) => {
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
    const result = await storeFile(file, 'tracks', newFilename);
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
    const result = await storeFile(file, 'covers', newFilename);
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
    const track = new Track(updateData);
    await track.save();
    res.status(201).json({ message: 'Track created', data: track });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// PUT update a track
router.put('/:trackId', [authenticateToken, isAdmin, handleFormidable], async (req, res) => {
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
    const result = await storeFile(file, 'tracks', newFilename);
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
    const result = await storeFile(file, 'covers', newFilename);
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
    // Update or create new track
    const track = await Track.findByIdAndUpdate(trackId, updateData, { new: true });
    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }
    res.status(200).json({ message: 'Track updated', data: track });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// DELETE a track
router.delete('/:trackId', [authenticateToken, isAdmin], async (req, res) => {
  const { trackId } = req.params;
  try {
    const track = await Track.findById(trackId);
    // Delete associated files
    if (track.track) {
      fs.unlinkSync(path.join(process.cwd(), 'public', track.track));
    }
    if (track.cover) {
      fs.unlinkSync(path.join(process.cwd(), 'public', track.cover));
    }
    await Track.deleteOne({ _id: trackId });
    res.status(200).json({ success: true, message: 'Track deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all comments for a track
router.get('/:trackId/comments', async (req, res) => {
  const { trackId } = req.params;

  try {
    const track = await Track
      .findById(trackId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: '_id name avatar'
        }
      })
      .lean();
    res.status(200).json(track.comments || []);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST a new comment to a track
router.post('/:trackId/comments', authenticateToken, async (req, res) => {
  const { trackId } = req.params;
  const userId = req.user.id;
  const { content, timestamp } = req.body;

  try {
    const comment = new Comment({
      userId,
      content,
      timestamp,
      trackId
    });
    await comment.save();
    await Track.findByIdAndUpdate(trackId, { $addToSet: { comments: comment._id } });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Failed to post comment:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
