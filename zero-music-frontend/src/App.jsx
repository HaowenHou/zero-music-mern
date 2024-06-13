import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlayerControl from './components/PlayerControl'
import Home from './pages/Home'
import Login from './pages/login'
import Favorites from './pages/favorites'
import PlaylistsRoutes from './pages/playlists/playlistRoutes'
import DriveRoutes from './pages/drive/driveRoutes'

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
                  <Route path="/favorites" element={<Favorites />} />
                  {PlaylistsRoutes}
                  {DriveRoutes}
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
