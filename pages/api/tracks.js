import formidable from "formidable";
import fs from "fs";
import path from "path";
import musicMetadata from 'music-metadata';

import dbConnect from '@/lib/dbConnect';
import Track from '@/models/Track';
import Playlist from '@/models/Playlist';
import { isTrackFavoritedByUser } from "@/lib/userUtils";

export default async function handle(req, res) {
  await dbConnect();
  const { method } = req;

  if (method == 'GET') {
    try {
      if (req.query?.id) {
        const track = await Track.findById(req.query.id).lean();
        if (req.query.userId && req.query.userId !== 'undefined') {
          const favorite = await isTrackFavoritedByUser(req.query.userId, req.query.id);
          track.favorite = favorite;
        }
        res.status(200).json(track);
      } else {
        const track = await Track.find({}).lean();
        res.status(200).json(track);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  if (method === 'DELETE') {
    try {
      if (req.query?.id) {
        // Delete the file from the storage
        const track = await Track.findById(req.query.id);
        if (track.track) {
          fs.unlinkSync(path.resolve(`./public${track.track}`));
        }
        if (track.cover) {
          fs.unlinkSync(path.resolve(`./public${track.cover}`));
        }
        await Track.deleteOne({ _id: req.query.id });
        // await Playlist.updateMany({}, { $pull: { musics: req.query.id } });
        res.json(true);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  if (method == 'POST') {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const newName = `${fields.title} - ${fields.artist}`;

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

        fs.renameSync(oldPath, newPath);

        return {
          newPath,
          webPath
        };
      };

      if (files.track) {
        const file = Array.isArray(files.track) ? files.track[0] : files.track;
        const result = await storeFile(file, 'tracks');
        trackPath = result.webPath;

        // Read music duration
        try {
          const metadata = await musicMetadata.parseFile(result.newPath);
          trackDuration = Math.round(metadata.format.duration);
        } catch (error) {
          console.error('Error reading metadata', error);
          res.status(500).json({ error: 'Failed to read file metadata' });
          return;
        }
      }

      if (files.cover) {
        const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
        const result = await storeFile(file, 'covers');
        coverPath = result.webPath;
      }

      const updateData = {
        title: fields.title[0],
        artist: fields.artist[0],
        duration: trackDuration,
        cover: coverPath || undefined, // Use undefined to avoid overwriting with empty if no new file
        track: trackPath || undefined,
      };

      try {
        // Check if the request contains an ID, if so, update the existing music
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
          // Add the track to the global playlist
          await Playlist.updateOne({ name: 'Global' }, { $push: { tracks: track._id } });
          res.status(201).json({ message: 'Track created', data: track });
        }
      } catch (error) {
        console.error('Database operation failed', error);
        res.status(500).json({ error: 'Database operation failed' });
      }
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};