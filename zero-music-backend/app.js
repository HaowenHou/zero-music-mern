import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { authenticateToken } from './utils/auth.js';
import playlistRouter from './routes/playlists.js';
import tracksRouter from './routes/tracks.js';
import chatRouter from './routes/chat.js';
import commentsRouter from './routes/comments.js';
import messagesRouter from './routes/messages.js';
import profileRouter from './routes/profile.js';
import driveRouter from './routes/drive.js';
import favoritesRouter from './routes/favorites.js';
import loginRouter from './routes/login.js';
import postsRouter from './routes/posts.js';
import searchRouter from './routes/search.js';
import usersRouter from './routes/users.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))
app.use(express.json());

app.use('/api/favorites', authenticateToken, favoritesRouter);
app.use('/api/playlists', authenticateToken, playlistRouter);
app.use('/api/drive', authenticateToken, driveRouter);

app.use('/api/comments', commentsRouter);
app.use('/api/messages', authenticateToken, messagesRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

// Partly protected routes
app.use('/api/users', usersRouter);
app.use('/api/tracks', tracksRouter);

app.use('/api/chat', chatRouter);
app.use('/api/login', loginRouter);
app.use('/api/search', searchRouter);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})