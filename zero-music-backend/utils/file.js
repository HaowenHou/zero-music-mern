import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

const storeFile = async (file, type, newFilename) => {
  const uploadsDir = path.join(process.cwd(), 'public');
  const oldPath = file.filepath;
  const newPath = path.join(uploadsDir, type, newFilename + path.extname(file.originalFilename));
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

export { storeFile, handleFormidable };