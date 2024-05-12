import dbConnect from "@/lib/dbConnect";
import Playlist from "@/models/Playlist";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  if (method === "GET") {
    // Get the Global playlist
    const globalPlaylist = await Playlist.findOne({ name: "Global" });
    if (!globalPlaylist) {
      return res.status(404).json({ error: "Global playlist not found" });
    }
    res.status(200).json(globalPlaylist);
  }

  // if (method === "POST") {
  //   try {
  //     const { name, description } = req.body;
  //     if (!name || !description) {
  //       return res.status(400).json({ error: "Missing name or description" });
  //     }
  //     const newPlaylist = new Playlist({ name, description, musics: [] });
  //     await newPlaylist.save();
  //     res.status(201).json(newPlaylist);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}