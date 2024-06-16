import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlayerControl from './components/PlayerControl'
import Home from './pages/Home'
import Login from './pages/login'
import Register from './pages/register'
import Favorites from './pages/favorites'
import PlaylistsRoutes from './pages/playlists/playlistsRoutes'
import DriveRoutes from './pages/drive/driveRoutes'
import PostsRoutes from './pages/posts/playlistsRoutes'
import Chat from './pages/chat'
import SearchResults from './pages/search/[q]'
import Profile from './pages/profile/[userId]'
import TracksRoutes from './pages/tracks/tracksRoutes'
import Playing from './pages/playing/[trackId]'

function App() {
  return (
    <>
      <div className='flex flex-col h-screen'>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <TopBar />
            <div className="h-full overflow-auto">
              {
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/favorites" element={<Favorites />} />
                  {PlaylistsRoutes}
                  {DriveRoutes}
                  {PostsRoutes}
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/search/:q" element={<SearchResults />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  {TracksRoutes}
                  <Route path="/playing/:trackId" element={<Playing />} />
                  <Route path="/forbidden" element={<div>Forbidden</div>} />
                  <Route path="*" element={<Home />} />
                </Routes>
              }
            </div>
          </div>
        </div>
        <PlayerControl />
      </div>
    </>
  )
}

export default App
