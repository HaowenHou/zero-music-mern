import dbConnect from "@/lib/dbConnect";
import Music from "@/models/Music";

export default async function handle(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { name, artist, cover } = req.body;
    console.log(name, artist, cover);
    const musicInfo = await Music.create({
      name, artist, cover
    });
    res.status(200).json({ musicInfo });
  }
}