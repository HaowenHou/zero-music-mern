import express from 'express';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Track from '../models/Track.js';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import { storeFile, handleFormidable } from '../utils/file.js';
import { addFavoriteStatus } from '../utils/tracks.js';

const router = express.Router();

// GET playlist by ID or global playlist
router.get('/:playlistId', async (req, res) => {
    const userId = req.user.id;
  const { playlistId } = req.params;
  if (playlistId === 'global') {
    // Get the Global playlist from the Track model
    const globalPlaylist = await Track.find().lean();
    res.status(200).json(await addFavoriteStatus(userId, globalPlaylist));
  } else {
    try {
      const playlist = await Playlist.findById(playlistId).populate('tracks').populate('userId', 'name _id').lean();
      playlist.tracks = await addFavoriteStatus(userId, playlist.tracks);
      res.status(200).json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// POST new playlist
router.post('', handleFormidable, async (req, res) => {
    const userId = req.user.id;
  const title = req.fields.title[0];
  const newFilename = `${title}-${userId}`;
  let coverPath = '';

  if (req.files.cover) {
    const file = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
    const result = await storeFile(file, 'playlistCovers', newFilename);
    coverPath = result.webPath;
  }

  const updateData = {
    title: req.fields.title[0],
    userId: new mongoose.Types.ObjectId(userId),
    cover: coverPath || undefined,
  };

  try {
    const playlist = new Playlist(updateData);
    await playlist.save();
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { playlists: playlist._id } },
      { new: true, safe: true, upsert: true }
    );
    res.status(201).json({ message: 'Playlist created', data: playlist });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// PUT update existing playlist
router.put('/:playlistId', handleFormidable, async (req, res) => {
  const { playlistId } = req.params;
    const userId = req.user.id;
  const title = req.fields.title[0];
  const newFilename = `${title}-${userId}`;
  let coverPath = '';

  // Make sure the playlist is owned by the user
  const playlist = await Playlist.findById(playlistId);
  if (playlist.userId.toString() !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.files.cover) {
    const file = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
    const result = await storeFile(file, 'playlistCovers', newFilename);
    coverPath = result.webPath;
  }

  const updateData = {
    title: req.fields.title[0],
    cover: coverPath || undefined,
  };

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      updateData,
      { new: true, safe: true, upsert: true }
    );
    res.status(200).json({ message: 'Playlist updated', data: playlist });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// DELETE a playlist
router.delete('/:playlistId', async (req, res) => {
    const userId = req.user.id;
  const { playlistId } = req.params;
  try {
    // Delete cover image if it exists
    const playlist = await Playlist.findById(playlistId);
    // Make sure the playlist is owned by the user
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (playlist.cover) {
      fs.unlinkSync(path.join(process.cwd(), 'public', playlist.cover));
    }
    // Delete the playlist
    await Playlist.findByIdAndDelete(playlistId);
    // Remove the playlist from the user's playlists
    await User.findByIdAndUpdate(
      userId,
      { $pull: { playlists: playlistId } },
      { new: true, safe: true, upsert: true }
    );
    // Delete the playlist from all the users' favorite playlists
    await User.updateMany(
      { favoritePlaylists: playlistId },
      { $pull: { favoritePlaylists: playlistId } }
    );
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Favorite playlist operations
router.post('/:playlistId/favorite', async (req, res) => {
    const userId = req.user.id;
  const { playlistId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error favoriting playlist", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

router.delete('/:playlistId/favorite', async (req, res) => {
    const userId = req.user.id;
  const { playlistId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error unfavoriting playlist", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

// Add a track to a playlist
router.post('/:playlistId/tracks', async (req, res) => {
    const { playlistId } = req.params;
  const { trackId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Make sure the playlist is owned by the user
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Playlist.findByIdAndUpdate(playlistId, {
      $addToSet: { tracks: new mongoose.Types.ObjectId(trackId) },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error adding track to playlist", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

// Remove a track from a playlist
router.delete('/:playlistId/tracks/:trackId', async (req, res) => {
    const { playlistId, trackId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Make sure the playlist is owned by the user
    if (playlist.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Playlist.findByIdAndUpdate(playlistId, {
      $pull: { tracks: new mongoose.Types.ObjectId(trackId) },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing track from playlist", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

export default router;
