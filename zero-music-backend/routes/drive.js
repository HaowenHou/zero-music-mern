import express from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import User from '../models/User.js';
import UserTrack from '../models/UserTrack.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  await dbConnect();

  try {
    const user = await User.findById(userId).populate("drive");
    const driveTracks = user.drive || [];
    res.status(200).json(driveTracks);
  } catch (error) {
    console.error('Failed to retrieve drive tracks:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve drive tracks' });
  }
});

router.delete('/:trackId', async (req, res) => {
  const { trackId } = req.params;

  await dbConnect();

  try {
    await UserTrack.findByIdAndDelete(trackId);
    res.status(200).json({ success: true, message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Failed to delete track:', error);
    res.status(500).json({ success: false, error: 'Failed to delete track' });
  }
});

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;

  await dbConnect();
  const form = formidable({ multiples: true });
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    const newName = `${fields.title} - ${fields.artist}`;
    let trackDuration = 0;
    let trackPath = '';
    let coverPath = '';

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

      return { newPath, webPath };
    };

    if (files.track) {
      const file = Array.isArray(files.track) ? files.track[0] : files.track;
      const result = await storeFile(file, 'driveTracks');
      trackPath = result.webPath;

      try {
        const metadata = await parseFile(result.newPath);
        trackDuration = Math.round(metadata.format.duration);
      } catch (error) {
        console.error('Error reading metadata:', error);
        res.status(500).json({ error: 'Failed to read file metadata' });
        return;
      }
    }

    if (files.cover) {
      const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
      const result = await storeFile(file, 'driveCovers');
      coverPath = result.webPath;
    }

    const updateData = {
      title: fields.title,
      artist: fields.artist,
      duration: trackDuration,
      cover: coverPath || undefined,
      track: trackPath || undefined,
    };

    try {
      if (fields.id) {
        const trackId = fields.id;
        const track = await UserTrack.findByIdAndUpdate(trackId, updateData, { new: true });
        if (!track) {
          res.status(404).json({ error: 'Track not found' });
          return;
        }
        res.status(200).json({ message: 'Track updated', data: track });
      } else {
        const track = new UserTrack(updateData);
        await track.save();
        await User.findByIdAndUpdate(userId, { $push: { drive: track._id } });
        res.status(201).json({ message: 'Track created', data: track });
      }
    } catch (error) {
      console.error('Database operation failed:', error);
      res.status(500).json({ error: 'Database operation failed' });
    }
  });
});

export default router;
