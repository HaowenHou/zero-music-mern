import { log } from "console";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export default async function handle(req, res) {
  const { method } = req;

  if (method == 'POST') {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        res.end();
        return;
      }

      const newName = `${fields.name} - ${fields.artist}`;

      if (files.track) {
        const file = Array.isArray(files.track) ? files.track[0] : files.track;
        const uploadsDir = path.resolve('./public/tracks');
        const oldPath = file.filepath;
        const newPath = path.join(uploadsDir, newName + path.extname(file.originalFilename));

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
          res.json({ message: 'File uploaded successfully', path: newPath });
        });
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }

      if (files.cover) {
        const file = Array.isArray(files.cover) ? files.cover[0] : files.cover;
        const uploadsDir = path.resolve('./public/covers');
        const oldPath = file.filepath;
        const newPath = path.join(uploadsDir, newName + path.extname(file.originalFilename));

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
          res.json({ message: 'File uploaded successfully', path: newPath });
        });
      }
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parser, letting Multer handle multipart/form-data
  },
};