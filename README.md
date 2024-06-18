# Zero Music

A full-stack online music app, developed using MERN stack (React, Express.js, MongoDB) and Electron. Libraries including Tailwind CSS, Redux, Socket.IO are adopted.

[comment]: <> (TODO: Demo images)

**Features:**

- :star: Favoriting music & Adding music to playlists (from context menu)
- :clipboard: Creating and managing playlists & Favoriting others' playlists
- :cloud: Personal music cloud drive
- :speaker: Posting thoughts with music & Viewing friends' posts
- :blush: Personal profile page, showing one's favorites, playlists and posts
- :envelope: Personal messaging (Socket.IO)
- :lock: User authentication with JWT

## How to run

**Tools needed:** Node v20.13.1, npm 10.5.2, MongoDB (local or cloud like Atlas)

[comment]: <> (TODO: MongoDB db setup)

**Dependency Installation:** `npm install` for both the frontend and backend.

**Backend:**

Inside the backend directory, create a `.env` file specifying environment variables as below:

```
PORT=""            # The port for backend
MONGO_URI=""       # MongoDB URI, local or cloud. E.g., "mongodb://localhost:27017/zero-music"
JWT_SECRET_KEY=""  # Secret key for JWT, which can be generated using `openssl rand -base64 64`
```

Run: `node app.js`

**Frontend:**

Inside the `.env.local` file, specify `VITE_SERVER_URL=` as the backend URL, *without a slash at the end*.
E.g., `"http://localhost:3000"`

Start React frontend: `npm run dev`

Start Electron client: `npm run electron:start`
