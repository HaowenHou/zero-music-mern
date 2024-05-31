import Track from "@/models/Track";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { q } = req.query;
  await dbConnect();

  try {
    const trackResults = await Track.find({
      title: { $regex: q, $options: 'i' } // 'i' makes it case insensitive
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
    res.status(500).json({ message: 'Error accessing the database', error });
  }
}
