import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlayerControl from './components/PlayerControl'
import Home from './pages/Home'
import Login from './pages/users/login'
import Register from './pages/users/register'
import UpdateUser from './pages/users/update'
import Favorites from './pages/favorites'
import PlaylistsRoutes from './pages/playlists/playlistsRoutes'
import DriveRoutes from './pages/drive/driveRoutes'
import PostsRoutes from './pages/posts/playlistsRoutes'
import Chat from './pages/chat'
import SearchResults from './pages/search/[q]'
import Profile from './pages/profile/[userId]'
import TracksRoutes from './pages/tracks/tracksRoutes'
import Playing from './pages/playing/[trackId]'

import { useDispatch } from 'react-redux';
import { setTrackIndex, setCurrentTrackId, setPlaylist } from './redux/actionCreators';
import { useEffect } from 'react'
import axios from 'axios'

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ }) => {
  const { userId } = useSelector((state) => state.userState);
  if (!userId) {
    return <Navigate to="/users/login" replace />;
  }
  return <Outlet />;
};

function App() {
  // Set initial playlist
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const { data: trackData } = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/tracks');
        if (!trackData.length) return;
        dispatch(setPlaylist(trackData));
        dispatch(setTrackIndex(0));
        dispatch(setCurrentTrackId(trackData[0]._id));
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchPlaylist();
  }, []);

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
                  <Route path="/users/login" element={<Login />} />
                  <Route path="/users/register" element={<Register />} />
                  <Route path="/search/:q" element={<SearchResults />} />
                  <Route path="/playing/:trackId" element={<Playing />} />
                  <Route path="/forbidden" element={<div>Forbidden</div>} />
                  <Route path="*" element={<Home />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/users/update" element={<UpdateUser />} />
                    {PlaylistsRoutes}
                    {DriveRoutes}
                    {PostsRoutes}
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    {TracksRoutes}
                  </Route>
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
