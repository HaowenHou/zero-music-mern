import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  
  if (method === 'POST') {
    const { userId, profileId } = req.body;

    const currentUser = await User.findOne({ _id: userId }).exec();
    const isCurrentlyFollowing = currentUser.following && currentUser.following.includes(profileId);

    if (isCurrentlyFollowing) {
      // Unfollow the profile user
      await User.updateOne(
        { _id: userId },
        { $pull: { following: profileId } }
      );
      res.status(200).json({ message: 'Unfollowed successfully', success: true });
    } else {
      // Follow the profile user
      await User.updateOne(
        { _id: userId },
        { $addToSet: { following: profileId } }
      );
      res.status(200).json({ message: 'Followed successfully', success: true });
    }
  }
}