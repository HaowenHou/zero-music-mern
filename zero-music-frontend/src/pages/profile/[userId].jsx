import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Tracklist from "../../components/Tracklist";
import PlaylistAsItem from "../../components/PlaylistAsItem";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites');
  const { userId } = useParams();

  // Get current user id to check whether this is the user's own profile.
  const { userId: currentUserId } = useSelector((state) => state.userState);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const { data: userData } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/user?uid=${userId}`);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchUser();
  }, [userId]);

  const fetchFollowingStatus = async () => {
    if (!currentUserId) return;
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/profile/isFollowing', {
        userId: currentUserId,
        profileId: userId
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error fetching following status', error);
    }
  };

  useEffect(() => {
    fetchFollowingStatus();
  }, [currentUserId, userId]);

  // Fetch favorites
  useEffect(() => {
    if (!userId || activeTab !== 'favorites') return;
    const fetchFavorites = async () => {
      try {
        const { data: playlists } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/favorites`);
        console.log(playlists);
        const trackDataPromises = playlists.favoritePlaylists.map(item =>
          axios.get(import.meta.env.VITE_SERVER_URL + `/api/tracks?id=${item._id}&userId=${userId}`).then(response => response.data)
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
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${currentUserId}/playlists`);
        setPlaylists(response.data.playlists);
        console.log(response.data.playlists);
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
        return <div className='mx-12 h-52'>
          <Tracklist tracks={tracks} showFavoriteButton={true} userId={userId} />
        </div>
      case 'playlists':
        return <div className='mt-6 mx-12 h-52'>
          {!!playlists.length && playlists.map((playlist) => (
            <PlaylistAsItem key={playlist._id} playlist={playlist} manageMode={false}
              showFavorite={currentUserId !== userId} onFavoriteClick={handleFavorite} onDelete={() => { }} />
          ))}
        </div>
      case 'posts':
        return <div>动态内容</div>;
      default:
        return null; // TODO
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/profile/follow', {
        userId: currentUserId,
        profileId: userId
      });
      if (response.data.success) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error('Error following user', error);
    }
  }

  const handleMessaging = () => {
    navigate(`/chat?uid=${userId}`);
  }

  const handleFavorite = async (playlistId) => {
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/playlists/favoritePlaylists`, {
        userId: currentUserId,
        playlistId
      });
      if (response.data.success) {
        const updatedPlaylists = playlists.map(playlist => {
          if (playlist._id === playlistId) {
            return { ...playlist, isFavorited: !playlist.isFavorited };
          }
          return playlist;
        });
        setPlaylists(updatedPlaylists);
      }
    } catch (error) {
      console.error('Error favoriting playlist', error);
    }
  }

  return (
    <>
      {user && (
        <div>
          <div className="flex ml-20 mt-10">
            <img src={import.meta.env.VITE_SERVER_URL + user.avatar} alt="Avatar" className="size-40 rounded-full" />
            <div className="flex flex-col ml-20 mt-4 gap-4">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex gap-4 text-lg">
                <span>关注：{user.following?.length || 0}</span>
                <span>粉丝：{user.followers?.length || 0}</span>
              </div>
              {/* {!user.location && <span className="text-lg">地区：{user.location}</span>} */}
              {currentUserId !== userId && (
                <div className="flex">
                  <button onClick={handleFollow} className="mx-4 py-1.5 bg-orange-300 rounded-3xl w-20">{isFollowing ? '已关注' : '关注'}</button>
                  <button onClick={handleMessaging} className="py-1.5 bg-orange-300 rounded-3xl w-20">私信</button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-20 justify-center text-lg mt-4 pb-3 mx-12 border-b">
              <button
                className={`px-3 py-1 rounded-2xl ${activeTab === 'favorites' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('favorites')}
              >收藏</button>
              <button
                className={`px-3 py-1 rounded-2xl ${activeTab === 'playlists' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('playlists')}
              >歌单</button>
              <button
                className={`px-3 py-1 rounded-2xl ${activeTab === 'posts' ? 'bg-orange-300' : ''}`}
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