import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import userRouter from './routes/user.js';
import playlistRouter from './routes/playlist.js';
import tracksRouter from './routes/tracks.js';
import chatRouter from './routes/chat.js';
import commentsRouter from './routes/comments.js';
import messagesRouter from './routes/messages.js';
import profileRouter from './routes/profile.js';
import driveRouter from './routes/drive.js';
import favoritesRouter from './routes/favorites.js';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import postsRouter from './routes/posts.js';
import searchRouter from './routes/search.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/playlist', playlistRouter);
app.use('/api/tracks', tracksRouter);
app.use('/api/chat', chatRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/drive', driveRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/posts', postsRouter);
app.use('/api/search', searchRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})