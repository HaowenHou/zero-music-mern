import express from 'express';
import User from '../models/User.js';
import dbConnect from '../utils/dbConnect.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.query.uid;
    await dbConnect();

    try {
        const user = await User.findById(userId);
        if (req.query.populate) {
            await user.populate(req.query.populate);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;
