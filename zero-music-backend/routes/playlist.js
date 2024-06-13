import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Track from '../models/Track.js';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

// Middleware to handle file uploads with formidable
const handleFormidable = (req, res, next) => {
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
};

router.use(handleFormidable);

// GET playlist by ID or global playlist
router.get('/:id?', async (req, res) => {
  await dbConnect();
  const { id } = req.params;
  if (id) {
    try {
      const playlist = await Playlist.findById(id).populate('tracks').populate('userId', 'name _id').lean();
      res.status(200).json(playlist);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    // Get the Global playlist from the Track model
    const globalPlaylist = await Track.find().lean();
    res.status(200).json(globalPlaylist);
  }
});

// POST new playlist or PUT update existing playlist
router.post('/', handleFormidable, async (req, res) => {
  await dbConnect();
  const userId = req.fields.userId[0];
  const newFilename = `${req.fields.title}-${userId}`;
  let coverPath = '';

  // Handle file storage
  const storeFile = async (file, type) => {
    const uploadsDir = path.resolve(`./public/${type}`);
    const oldPath = file.filepath;
    const newPath = path.join(uploadsDir, newFilename + path.extname(file.originalFilename));
    const webPath = `/${type}/` + newFilename + path.extname(file.originalFilename);

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

  if (req.files.cover) {
    const file = Array.isArray(req.files.cover) ? req.files.cover[0] : req.files.cover;
    const result = await storeFile(file, 'playlistCovers');
    coverPath = result.webPath;
  }

  const updateData = {
    title: req.fields.title[0],
    userId: new mongoose.Types.ObjectId(userId),
    cover: coverPath || undefined, // Use undefined to avoid overwriting with empty if no new file
  };

  try {
    const playlist = new Playlist(updateData);
    await playlist.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { playlists: playlist._id } },
      { new: true, safe: true, upsert: true }
    );
    res.status(201).json({ message: 'Playlist created', data: playlist });
  } catch (error) {
    console.error('Database operation failed', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// DELETE a playlist
router.delete('/:playlistId', async (req, res) => {
  await dbConnect();
  const { playlistId } = req.params;
  try {
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
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
router.post('/favorite', async (req, res) => {
  await dbConnect();
  const { userId, playlistId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favoritePlaylists.includes(playlistId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { favoritePlaylists: new mongoose.Types.ObjectId(playlistId) },
      });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error favoriting playlist", error);
    res.status(500).json({ error: "Database operation failed" });
  }
});

export default router;
