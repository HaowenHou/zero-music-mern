import formidable from "formidable";
import fs from "fs";
import path from "path";

import dbConnect from '@/lib/dbConnect';
import Music from '@/models/Music';

export default async function handle(req, res) {
  const { method } = req;
  var musicDuration = 0;
  var trackPath = '';
  var coverPath = '';

  if (method == 'POST') {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        res.end();
        return;
      }

      const newName = `${fields.name} - ${fields.artist}`;

      // Save the music file
      const musicMetadata = require('music-metadata');
      if (files.track) {
        const file = Array.isArray(files.track) ? files.track[0] : files.track;
        const uploadsDir = path.resolve('./public/tracks');
        const oldPath = file.filepath;
        const newPath = path.join(uploadsDir, newName + path.extname(file.originalFilename));
        trackPath = newPath;

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true }); // 'recursive: true' ensures that nested directories are created
        }

        // Move the file to the new location
        fs.rename(oldPath, newPath, async (err) => {
          if (err) {
            console.error('Error moving the file', err);
            res.status(500).json({ error: 'Failed to move file' });
            return;
          }

          // Get the duration
          try {
            const metadata = await musicMetadata.parseFile(newPath);
            musicDuration = Math.round(metadata.format.duration);  // Duration in seconds
          } catch (metadataError) {
            console.error('Error reading metadata', metadataError);
            res.status(500).json({ error: 'Failed to read file metadata' });
          }
        });
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }

      // Save the cover image
      if (files.cover) {
        const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
        const uploadsDir = path.resolve('./public/covers');
        const oldPath = file.filepath;
        const newPath = path.join(uploadsDir, newName + path.extname(file.originalFilename));
        coverPath = newPath;

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true }); // 'recursive: true' ensures that nested directories are created
        }

        // Move the file to the new location
        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error('Error moving the file', err);
            res.status(500).json({ error: 'Failed to move file' });
            return;
          }


        });
      }

      // Save to the database
      await dbConnect();
      const music = new Music({
        name: fields.name[0],
        artist: fields.artist[0],
        duration: musicDuration,
        cover: coverPath,
        track: trackPath,
      });
      await music.save();
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parser, letting Multer handle multipart/form-data
  },
};