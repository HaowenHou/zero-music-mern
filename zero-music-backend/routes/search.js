import express from 'express';
import Track from '../models/Track.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  
  try {
    const trackResults = await Track.find({
      title: { $regex: q, $options: 'i' }
    }).select('_id title cover artist duration').exec();

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
