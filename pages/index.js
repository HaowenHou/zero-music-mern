import React from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import UserArea from './components/UserArea';
import Playlist from './components/Playlist';
import PlayerControl from './components/PlayerControl';
import { useSession, signIn, signOut } from "next-auth/react"

function App() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="main-content">
          <SearchBar />
          <div className='text-center'>
            <button onClick={() => signIn('google')} className='bg-orange-100 rounded-lg px-3 py-1 font-semibold'>Login with Google</button>
          </div>
          <UserArea />
          <Playlist />
        </div>
        <PlayerControl />
      </div>
    );
  }
  return <div>Logged in</div>
}

export default App;
