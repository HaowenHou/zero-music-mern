import User from "@/models/User";
import UserTrack from "@/models/UserTrack";
import dbConnect from "@/lib/dbConnect";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import musicMetadata from "music-metadata";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const { userId } = req.query;
      const user = await User.findById(userId).populate("drive");
      const driveTracks = user.drive;
      res.status(200).json(driveTracks);
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  if (method === "DELETE") {
    try {
      const { trackId } = req.query;
      await UserTrack.findByIdAndDelete(trackId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  if (method == 'POST') {
    const { userId } = req.query;
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      console.log('fields', fields);
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
        const result = await storeFile(file, 'driveTracks');
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
        const result = await storeFile(file, 'driveCovers');
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
          const track = await UserTrack.findByIdAndUpdate(trackId, updateData, { new: true });
          if (!track) {
            res.status(404).json({ error: 'Track not found' });
            return;
          }
          res.status(200).json({ message: 'Track updated', data: track });
        } else {
          const track = new UserTrack(updateData);
          await track.save();
          // Add the track to the user's drive
          await User.findByIdAndUpdate(userId, { $push: { drive: track._id } }).exec();
          res.status(201).json({ message: 'Track created', data: track });
        }
      } catch (error) {
        console.error('Database operation failed', error);
        res.status(500).json({ error: 'Database operation failed' });
      }
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};