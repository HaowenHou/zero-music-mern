import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Tracklist from "../../components/Tracklist";
import PlaylistAsItem from "../../components/PlaylistAsItem";
import Post from "../../components/Post";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites');
  const { userId } = useParams();

  // Get current user id to check whether this is the user's own profile.
  const { userId: currentUserId } = useSelector((state) => state.userState);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const { data: userData } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}`);
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
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${currentUserId}`);
      setIsFollowing(response.data.following.includes(userId));
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
        const { data: trackData } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/favorites`);
        setTracks(trackData);
      } catch (error) {
        console.error('Error fetching favorites data', error);
      }
    };
    fetchFavorites();
  }, [userId, activeTab]);

  // Fetch posts
  useEffect(() => {
    if (!userId || activeTab !== 'posts') return;
    const fetchPosts = async () => {
      try {
        const { data: postData } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/posts`);
        setPosts(postData);
      } catch (error) {
        console.error('Error fetching posts data', error);
      }
    }
    fetchPosts();
  }, [userId, activeTab]);

  // Get user playlists
  useEffect(() => {
    if (!userId || activeTab !== 'playlists') return;
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/playlists`);
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
        return <div className='mx-12 h-52 flex justify-center'>
          <div className="w-full max-w-4xl">
            <Tracklist tracks={tracks} showFavoriteButton={true} userId={userId} />
          </div>
        </div>
      case 'playlists':
        return <div className='mt-6 mx-24 h-52 flex justify-center'>
          <div className="w-full max-w-4xl">
            {!!playlists.length && playlists.map((playlist) => (
              <PlaylistAsItem key={playlist._id} playlist={playlist} manageMode={false}
                showFavorite={currentUserId !== userId} onFavoriteClick={handleFavorite} onDelete={() => { }} />
            ))}
          </div>
        </div>
      case 'posts':
        return <div className='flex mt-6 mx-12 justify-center'>
          <div className="w-full max-w-2xl space-y-4">
            {posts.map((post) => (
              <Post key={post._id} post={post} manageMode={false} className='' />
            ))}
          </div>
        </div>;
      default:
        return null; // TODO
    }
  };

  const handleFollow = async () => {
    try {
      let response;
      if (isFollowing) {
        response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/follow`);
      } else {
        response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/follow`);
      }
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
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/playlists/${playlistId}/favorite`);
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
                <span>{t("following") + ": " + user.following?.length || 0}</span>
                <span>{t("followers") + ": " + user.followers?.length || 0}</span>
              </div>
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
              >{t("favorites")}</button>
              <button
                className={`px-3 py-1 rounded-2xl ${activeTab === 'playlists' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('playlists')}
              >{t("playlists")}</button>
              <button
                className={`px-3 py-1 rounded-2xl ${activeTab === 'posts' ? 'bg-orange-300' : ''}`}
                onClick={() => handleTabClick('posts')}
              >{t("posts")}</button>
            </div>
            {getTabContent()}
          </div>
        </div >
      )
      }
    </>
  );
}