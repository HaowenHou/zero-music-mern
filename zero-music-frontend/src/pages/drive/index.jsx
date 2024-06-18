import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Tracklist from "../../components/Tracklist";
import { Link } from "react-router-dom";
import { handlePlayPlaylist } from "../../utils/play";
import { useTranslation } from 'react-i18next';

export default function UserDrive() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [tracks, setTracks] = useState([]);
  const { userId } = useSelector((state) => state.userState);

  // Get tracks in the user's drive
  useEffect(() => {
    if (!userId) return;
    const fetchPlaylist = async () => {
      try {
        const { data: driveTracks } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/drive`);

        setTracks(driveTracks);
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
            <h1 className="text-2xl font-bold">{t("myDrive")}</h1>
            <div className="flex">
              <button onClick={() => handlePlayPlaylist(dispatch, tracks)} className='flex mt-4 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 bg-orange-400 rounded-full fill-white p-1.5 pl-2">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                <h2 className='pl-2 text-xl font-bold pb-0.5'>{t("playDrive")}</h2>
              </button>
              <Link to='/drive/manage' className="flex mt-4 items-center ml-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 rounded-full fill-orange-400">
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                </svg>
                <h2 className='ml-2 text-xl font-bold pb-0.5'>{t("manageDrive")}</h2>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Tracklist tracks={tracks} showFavoriteButton={false} userId={userId} />
        </div>

      </div>
    </>
  );
}
