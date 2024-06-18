import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Tracklist from "../../components/Tracklist";
import { useParams } from "react-router-dom";
import { handlePlayPlaylist } from "../../utils/play";
import { useTranslation } from 'react-i18next';

export default function Playlist() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [manageMode, setManageMode] = useState(false);
  const { userId } = useSelector((state) => state.userState);

  // Get playlist info
  useEffect(() => {
    if (!playlistId) return;
    const getPlaylist = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/playlists/${playlistId}`);
        setPlaylist(response.data);
        setTracks(response.data.tracks);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    getPlaylist();
  }, [playlistId]);

  const handleToggleManageMode = () => {
    setManageMode(!manageMode);
  };

  const handleRemoveFromPlaylist = async (trackId) => {
    try {
      const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/playlists/${playlistId}/tracks/${trackId}`);
      if (response.status === 200) {
        setTracks(tracks.filter(track => track._id !== trackId));
      } else {
        console.error('Failed to remove track from playlist');
      }
    } catch (error) {
      console.error('Error removing track from playlist', error);
    }
  };

  if (!playlist) {
    return null;
  }

  return (
    <>
      <div className="bg-white p-12">
        <div className="flex items-center mb-4 p-4 pb-8 border-b border-gray-600">
          <div className='relative'>
            <img src={import.meta.env.VITE_SERVER_URL + (playlist.cover || '/assets/default-cover-1.png')} className='size-28 rounded-lg' />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>

          </div>

          <div className='pl-8'>
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold">{playlist.title}</h1>
              <h2 className="text-sm font-medium ml-1"> - {playlist.userId.name}</h2>
            </div>
            <div className="flex">
              <button onClick={() => handlePlayPlaylist(dispatch, tracks)} className='flex mt-4 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 bg-orange-400 rounded-full fill-white p-1.5 pl-2">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                <h2 className='pl-2 text-xl font-bold pb-0.5'>{t("playPlaylist")}</h2>
              </button>
              {userId === playlist.userId._id && (
                manageMode ? (
                  <button onClick={handleToggleManageMode} className="flex mt-4 items-center ml-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 rounded-full fill-orange-400">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                    <h2 className='ml-2 text-xl font-bold pb-0.5'>{t("finish")}</h2>
                  </button>
                ) : (
                  <button onClick={handleToggleManageMode} className="flex mt-4 items-center ml-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 rounded-full fill-orange-400">
                      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                    </svg>
                    <h2 className='ml-2 text-xl font-bold pb-0.5'>{t("managePlaylists")}</h2>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 mx-4">
          <Tracklist tracks={tracks} showFavoriteButton={false} userId={userId}
            manageMode={manageMode} handleRemoveFromPlaylist={handleRemoveFromPlaylist} />
        </div>
      </div>
    </>
  );
}
