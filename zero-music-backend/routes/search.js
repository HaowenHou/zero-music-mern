import express from 'express';
import jwt from 'jsonwebtoken';
import Track from '../models/Track.js';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SIGNING_PRIVATE_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    const { q } = req.query;
    await dbConnect();

    try {
        const trackResults = await Track.find({
            title: { $regex: q, $options: 'i' }
        }).select('_id title cover duration').exec();

        const userResults = await User.find({
            name: { $regex: q, $options: 'i' }
        }).select('_id name avatar').exec();

        const results = {
            tracks: trackResults,
            users: userResults
        };

        res.status(200).json(results);
    } catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ message: 'Error accessing the database', error });
    }
});

export default router;
