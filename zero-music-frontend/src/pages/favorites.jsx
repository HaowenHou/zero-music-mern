import axios from "axios";
import { useEffect, useState } from "react";
import Tracklist from "../components/Tracklist";
import { useSelector, useDispatch } from "react-redux";
import { handlePlayPlaylist } from "../utils/play";
import { useTranslation } from 'react-i18next';

export default function Favorites() {
  const { t } = useTranslation();
  const { userId } = useSelector((state) => state.userState);
  const [tracks, setTracks] = useState([]);
  const dispatch = useDispatch();

  // Get user favorites
  useEffect(() => {
    if (!userId) return;
    const fetchPlaylist = async () => {
      try {
        const { data: trackData } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/current/favorites`);
        setTracks(trackData);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchPlaylist();
  }, [userId]);

  return (
    <>
      <div className="bg-white p-12">
        <div className="flex items-center mb-4 p-4 pb-8 border-b border-gray-600">
          <div className='relative'>
            <img src={import.meta.env.VITE_SERVER_URL + "/assets/default-favorite.png"} className='size-28 rounded-lg' />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>

          </div>

          <div className='pl-8'>
            <h1 className="text-2xl font-bold">{t("myFavorites")}</h1>
            <button onClick={() => handlePlayPlaylist(dispatch, tracks)} className='flex mt-4 items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 bg-orange-400 rounded-full fill-white p-1.5 pl-2">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              <h2 className='pl-2 text-xl font-bold pb-0.5'>{t("playPlaylist")}</h2>
            </button>
          </div>
        </div>

        <div className="mt-8 mx-4">
          <Tracklist tracks={tracks} showFavoriteButton={true} userId={userId} />
        </div>
      </div>
    </>
  );
}
