import React from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import UserArea from './components/UserArea';
import Playlist from './components/Playlist';
import PlayerControl from './components/PlayerControl';
import Layout from './components/Layout';
import { useSession, signIn, signOut } from "next-auth/react"
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Layout>
      <div className='text-center'>
        <Register />
        <Login />
        <Profile />
      </div>
    </Layout>
  );
}

export default App;
