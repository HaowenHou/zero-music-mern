import dbConnect from '@/lib/dbConnect';
import Music from '@/models/Music';

export default async function handle(req, res) {
  await dbConnect();
  const { method } = req;

  if (method == 'GET') {
    try {
      if (req.query?.id) {
        const music = await Music.findById(req.query.id).lean();
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
    if (req.query?.id) {
      await Music.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  };
};