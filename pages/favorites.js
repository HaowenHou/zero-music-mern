import axios from "axios";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";

export default function Favorites() {
  const [tracks, setTracks] = useState([]);
  // Get user id
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Get user favorites
  useEffect(() => {
    if (!userId) return;
    const fetchPlaylist = async () => {
      try {
        const { data: favoriteList } = await axios.get(`/api/favorites?id=${userId}`);

        const musicDataPromises = favoriteList.map(async (item) => {
          const { data: trackData } = await axios.get(`/api/tracks?id=${item}&userId=${userId}`);
          return trackData;
        });

        const musicData = await Promise.all(musicDataPromises);
        setTracks(musicData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchPlaylist();
  }, [userId]);  // Duplicate from index.js

  // useEffect(() => {
  //   if (!userId) return;
  //   axios.get('/api/favorites?id=' + userId).then((res) => {
  //     console.log(res.data);
  //     // setFavorites(res.data);
  //   });
  // }, [userId]);

  return (
    <>
      <div className='text-center'>
      </div>

      <div className="bg-white p-12">
        <div className="flex items-center mb-4 p-4 pb-8 border-b border-gray-600">
          <div className='relative'>
            <img src="/albums/1.png" className='size-28 rounded-lg' />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>

          </div>

          <div className='pl-8'>
            <h1 className="text-2xl font-bold">我的收藏</h1>
            <button className='flex mt-4 items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 bg-orange-400 rounded-full fill-white p-1.5 pl-2">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              <h2 className='pl-2 text-xl font-bold pb-0.5'>播放歌单</h2>
            </button>
          </div>
        </div>

        <div className="mt-8">
          {userId && tracks && tracks.map((track) => (
            <TrackItem
              key={track._id}
              track={track}
              onPlayClick={() => playPlaylist(tracks, index)}
              showFavoriteButton={false}
            />
            // <div className="flex items-center mb-6" key={track._id}>
            //   <img
            //     src={track.cover || '/albums/3.png'}
            //     alt="Album Cover"
            //     className="w-12 h-12 mr-6 rounded-md"
            //   />
            //   <div className='flex'>
            //     <div className='w-64'>
            //       <h2 className="font-semibold ml-6">{track.name}</h2>
            //     </div>
            //     <p className=''>{track.artist}</p>
            //   </div>
            //   <span className="ml-auto mr-3">{formatTime(track.duration)}</span>
            // </div>
          ))}
        </div>

      </div>
    </>
  );
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}  // Three duplicates