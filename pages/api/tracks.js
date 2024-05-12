import formidable from "formidable";
import fs from "fs";
import path from "path";
import musicMetadata from 'music-metadata';

import dbConnect from '@/lib/dbConnect';
import Music from '@/models/Music';
import Playlist from '@/models/Playlist';
import { isTrackFavoritedByUser } from "@/lib/userUtils";

export default async function handle(req, res) {
  await dbConnect();
  const { method } = req;

  // // If there is not a global playlist, create one
  // const globalPlaylist = await Playlist.findOne({ name: 'Global' });
  // if (!globalPlaylist) {
  //   const newPlaylist = new Playlist({
  //     name: 'Global',
  //     description: 'The global playlist',
  //     musics: []
  //   });
  //   await newPlaylist.save();
  // }

  // // Ensure all the tracks are in the global playlist
  // const allMusics = await Music.find({});
  // const globalMusics = globalPlaylist.musics.map((id) => id.toString());
  // const newMusics = allMusics.filter((music) => !globalMusics.includes(music._id.toString()));
  // if (newMusics.length > 0) {
  //   await Playlist.updateOne({ name: 'Global' }, { $push: { musics: { $each: newMusics.map((music) => music._id.toString() )} } });
  // }

  if (method == 'GET') {
    try {
      if (req.query?.id) {
        // Rename the name field to title
        // Music.updateMany({}, { $rename: { "name": "title" } })
        //   .then(result => {
        //     console.log('Update successful', result);
        //   })
        //   .catch(err => {
        //     console.error('Error updating documents', err);
        //   });
        const music = await Music.findById(req.query.id).lean();
        if (req.query.userId && req.query.userId !== 'undefined') {
          const favorite = await isTrackFavoritedByUser(req.query.userId, req.query.id);
          music.favorite = favorite;
        }
        res.status(200).json(music);
      } else {
        const music = await Music.find({}).lean();
        res.status(200).json(music);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  if (method === 'DELETE') {
    try {
      if (req.query?.id) {
        // Delete the file from the storage
        const music = await Music.findById(req.query.id);
        if (music.track) {
          fs.unlinkSync(path.resolve(`./public${music.track}`));
        }
        if (music.cover) {
          fs.unlinkSync(path.resolve(`./public${music.cover}`));
        }
        await Music.deleteOne({ _id: req.query.id });
        await Playlist.updateMany({}, { $pull: { musics: req.query.id } });
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

      const newName = `${fields.name} - ${fields.artist}`;

      let musicDuration = 0;
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
          musicDuration = Math.round(metadata.format.duration);
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
        name: fields.name[0],
        artist: fields.artist[0],
        duration: musicDuration,
        cover: coverPath || undefined, // Use undefined to avoid overwriting with empty if no new file
        track: trackPath || undefined,
      };

      try {
        // Check if the request contains an ID, if so, update the existing music
        if (fields.id) {
          const musicId = fields.id;
          const music = await Music.findByIdAndUpdate(musicId, updateData, { new: true });
          if (!music) {
            res.status(404).json({ error: 'Music not found' });
            return;
          }
          res.status(200).json({ message: 'Music updated', data: music });
        } else {
          const music = new Music(updateData);
          await music.save();
          // Add the music to the global playlist
          await Playlist.updateOne({ name: 'Global' }, { $push: { musics: music._id.toString() } });
          res.status(201).json({ message: 'Music created', data: music });
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
    bodyParser: false, // Disabling body parser, letting formidable handle multipart/form-data
  },
};