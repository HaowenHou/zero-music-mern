import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

export default function New() {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [trackId, setTrackId] = useState(null);
  const [tracks, setTracks] = useState([]); // This will hold the search results
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.userState);

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    if (!event.target.value) {
      setTracks([]);
      return;
    }
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/search?q=${searchTerm}`);
      console.log(response.data.tracks)
      setTracks(response.data.tracks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/posts', {
        content,
        trackId,
        userId
      });
    } catch (error) {
      console.error(error);
    }
    navigate('/posts');
  };



  const handleCancel = () => {
    setTrackId(null);
    setSelectedTrack(null);
    setSearchTerm('');
  };

  return (
    <div className="flex justify-center m-12 mx-24 space-x-2">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold">{t("newPost")}</h1>
        <form>
          <textarea
            className="w-full h-32 p-2 rounded-lg mt-12"
            placeholder={t("postContentPrompt")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
        <input
          type="text"
          placeholder={t("postSelectMusic")}
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded mt-12"
        />
        {trackId && (
          <div className='flex m-2 items-center'>
            {selectedTrack.title}
            <img src={import.meta.env.VITE_SERVER_URL + selectedTrack.cover} alt=""
              className='ml-auto rounded-lg h-8 w-8' />
            <button onClick={handleCancel} className="border border-red-400 rounded-lg py-1 px-2 ml-1.5 hover:bg-red-400">
              {t("cancel")}
            </button>
          </div>
        )}
        <ul className="mt-2">
          {!!tracks.length && tracks.map(track => (
            <li
              key={track._id}
              className={`p-2 ${trackId === track._id ? 'bg-gray-300' : 'hover:bg-gray-100'} cursor-pointer rounded-lg`}
              onClick={() => { setTrackId(track._id); setSelectedTrack(track); setSearchTerm(track.title); }}
            >
              <div className='flex items-center'>
                {track.title}
                <img src={import.meta.env.VITE_SERVER_URL + track.cover} alt=""
                  className='ml-auto rounded-lg h-8 w-8' />
              </div>
            </li>
          ))}
        </ul>

        <button onClick={handleSubmit} className="bg-orange-400 text-white rounded-lg px-4 py-2 mt-2">
          {t("post")}
        </button>
      </div>
    </div>
  );
}