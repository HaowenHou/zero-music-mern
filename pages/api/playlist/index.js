import formidable from "formidable";
import fs from "fs";
import path from "path";

import dbConnect from '@/lib/dbConnect';
import Playlist from '@/models/Playlist';
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST' || method === 'PUT') {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      const { id } = req.query;
      const userId = fields.userId[0];
      const newFilename = `${fields.title}-${userId}`;

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

      if (files.cover) {
        const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
        const result = await storeFile(file, 'playlistCovers');
        coverPath = result.webPath;
      }

      const updateData = {
        title: fields.title[0],
        userId: new mongoose.Types.ObjectId(userId),
        cover: coverPath || undefined, // Use undefined to avoid overwriting with empty if no new file
      };

      try {
        if (method === 'POST') {
          const playlist = new Playlist(updateData);
          await playlist.save();
          await User.findByIdAndUpdate(
            userId,
            { $push: { playlists: playlist._id } },
            { new: true, safe: true, upsert: true }
          );
          // Add the track to the global playlist
          res.status(201).json({ message: 'Playlist created', data: playlist });
        } else if (method === 'PUT' && id) {
          const playlist = await Playlist.findByIdAndUpdate(id, updateData, { new: true });
          if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
          }
          res.status(200).json({ message: 'Playlist updated', data: playlist });
        }
      } catch (error) {
        console.error('Database operation failed', error);
        res.status(500).json({ error: 'Database operation failed' });
      }
    });
  }

  // if id is provided, fetch the specific playlist
  // otherwise, fetch the global playlist
  if (method === "GET") {
    const { id } = req.query;
    if (id) {
      try {
        const playlist = await Playlist.findById(id).exec();
        res.status(200).json(playlist);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    } else {
      // Get the Global playlist
      const globalPlaylist = await Playlist.findOne({ title: "Global" });
      if (!globalPlaylist) {
        return res.status(404).json({ error: "Global playlist not found" });
      }
      res.status(200).json(globalPlaylist);
    }
  }

  if (method === "DELETE") {
    const { userId, playlistId } = req.query;
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
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};