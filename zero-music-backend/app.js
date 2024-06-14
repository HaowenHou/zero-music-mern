import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { authenticateToken } from './utils/auth.js';
import userRouter from './routes/user.js';
import playlistRouter from './routes/playlists.js';
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
import usersRouter from './routes/users.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))
app.use(express.json());

app.use('/api/users', authenticateToken, usersRouter);
app.use('/api/favorites', authenticateToken, favoritesRouter);

app.use('/api/user', authenticateToken, userRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/messages', authenticateToken, messagesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

// Partly protected routes
app.use('/api/playlists', playlistRouter);

app.use('/api/chat', chatRouter);
app.use('/api/drive', driveRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/search', searchRouter);

app.use('/api/tracks', tracksRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})