import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function New() {
  const [content, setContent] = useState('');
  const [trackId, setTrackId] = useState(null);
  const [tracks, setTracks] = useState([]); // This will hold the search results
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.userState);

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/search?q=${searchTerm}`);
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

  return (
    <div className="flex m-4 space-x-2">
      <div className="w-1/2">
        <form>
          <textarea
            className="w-full h-32 p-2 rounded-lg"
            placeholder="想说点什么？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSubmit} className="bg-orange-400 text-white rounded-lg px-4 py-2 mt-2">
            发布
          </button>
        </form>
      </div>

      <div className="w-1/2">
        <input
          type="text"
          placeholder="Search for tracks"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
        <ul className="mt-2">
          {!!tracks.length && tracks.map(track => (
            <li
              key={track._id}
              className={`p-2 ${trackId === track._id ? 'bg-gray-300' : 'hover:bg-gray-100'} cursor-pointer`}
              onClick={() => setTrackId(track._id)}
            >
              {track.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}