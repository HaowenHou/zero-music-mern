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

      if (files.file) {
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const uploadsDir = path.resolve('./public/uploads');
        const oldPath = file.filepath;
        const newPath = path.join(uploadsDir, file.originalFilename);

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
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disabling body parser, letting Multer handle multipart/form-data
  },
};