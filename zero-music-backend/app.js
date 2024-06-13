import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import userRouter from './routes/user.js';
import playlistRouter from './routes/playlist.js';
import tracksRouter from './routes/tracks.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/tracks', tracksRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})