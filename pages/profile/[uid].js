import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Tracklist from "../components/Tracklist";
import PlaylistAsItem from "../components/PlaylistAsItem";
import { useRouter } from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const router = useRouter();
  const { uid: userId } = router.query;

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const { data: userData } = await axios.get(`/api/user?uid=${userId}`);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch favorites
  useEffect(() => {
    if (!userId || activeTab !== 'favorites') return;
    const fetchFavorites = async () => {
      try {
        const { data: favoriteList } = await axios.get(`/api/favorites?id=${userId}`);
        // console.log(favoriteList);
        const trackDataPromises = favoriteList.map(item =>
          axios.get(`/api/tracks?id=${item}&userId=${userId}`).then(response => response.data)
        );
        const trackData = await Promise.all(trackDataPromises);
        setTracks(trackData);
        // console.log(trackData);
      } catch (error) {
        console.error('Error fetching favorites data', error);
      }
    };
    fetchFavorites();
  }, [userId, activeTab]);

  // Get user playlists
  useEffect(() => {
    if (!userId || activeTab !== 'playlists') return;
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`/api/playlist/${userId}`);
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchPlaylists();
  }, [userId, activeTab]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        // return <div>{tracks.length > 0 && tracks.map(track => <div key={track._id}>{track.title}</div>)}</div>;
        return <div className='mx-12 h-52 overflow-hidden hover:overflow-y-auto'>
          <Tracklist tracks={tracks} showFavoriteButton={true} userId={userId} />;
        </div>
      case 'playlists':
        return <div className='mt-6 mx-12 h-52 overflow-hidden hover:overflow-y-auto'>
          {playlists.length > 0 && playlists.map((playlist) => (
            <PlaylistAsItem key={playlist._id} playlist={playlist} manageMode={false} onDelete={() => { }} />
          ))}
        </div>
      case 'posts':
        return <div>动态内容</div>;
      default:
        return null;
    }
  };

  return (
    <>
      {user && (
        <div>
          <div className="flex ml-20 mt-10">
            <img src={user.avatar} alt="Avatar" className="size-40 rounded-full" />
            <div className="flex flex-col ml-20 mt-4 gap-4">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex gap-4 text-lg">
                <span>关注：{user.followed?.length || 0}</span>
                <span>粉丝：{user.followers?.length || 0}</span>
              </div>
              {!user.location && <span className="text-lg">地区：{user.location}</span>}
            </div>
          </div>

          <div>
            <div className="flex gap-20 justify-center text-lg mt-4 pb-3 mx-12 border-b">
              <button
                className={`px-1.5 py-0.5 rounded-lg ${activeTab === 'favorites' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('favorites')}
              >收藏</button>
              <button
                className={`px-1.5 py-0.5 rounded-lg ${activeTab === 'playlists' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('playlists')}
              >歌单</button>
              <button
                className={`px-1.5 py-0.5 rounded-lg ${activeTab === 'posts' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('posts')}
              >动态</button>
            </div>
            {getTabContent()}
          </div>
        </div >
      )
      }
    </>
  );
}