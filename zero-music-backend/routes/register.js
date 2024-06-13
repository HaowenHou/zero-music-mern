import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

// Setup multer for avatar file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avatars/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// POST to register a new user
router.post('/', upload.single('avatar'), async (req, res) => {
    await dbConnect();
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const avatarPath = req.file ? `/avatars/${req.file.filename}` : undefined;

        const user = new User({
            username,
            password: hashedPassword,
            avatar: avatarPath,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

export default router;
