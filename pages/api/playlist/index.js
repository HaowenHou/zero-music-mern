import formidable from "formidable";
import fs from "fs";
import path from "path";

import dbConnect from '@/lib/dbConnect';
import Playlist from '@/models/Playlist';
import User from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'POST') {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

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

        fs.renameSync(oldPath, newPath);

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
        userId: userId,
        cover: coverPath || undefined, // Use undefined to avoid overwriting with empty if no new file
      };

      try {
        // Check if the request contains an ID, if so, update the existing music
        // if (fields.id) {
        //   const trackId = fields.id;
        //   const track = await Track.findByIdAndUpdate(trackId, updateData, { new: true });
        //   if (!track) {
        //     res.status(404).json({ error: 'Track not found' });
        //     return;
        //   }
        //   res.status(200).json({ message: 'Track updated', data: track });
        // } else {
          const playlist = new Playlist(updateData);
          await playlist.save();
          await User.findByIdAndUpdate(
            userId,
            { $push: { playlists: playlist._id.toString() } },
            { new: true, safe: true, upsert: true }
          );
          // Add the track to the global playlist
          res.status(201).json({ message: 'Playlist created', data: playlist });
        // }
      } catch (error) {
        console.error('Database operation failed', error);
        res.status(500).json({ error: 'Database operation failed' });
      }
    });
  }

  if (method === "GET") {
    // Get the Global playlist
    const globalPlaylist = await Playlist.findOne({ name: "Global" });
    if (!globalPlaylist) {
      return res.status(404).json({ error: "Global playlist not found" });
    }
    res.status(200).json(globalPlaylist);
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parser, letting formidable handle multipart/form-data
  },
};