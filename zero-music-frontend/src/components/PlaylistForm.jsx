import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatImageUrl } from "../utils/url";
import { useTranslation } from 'react-i18next';

export default function PlaylistForm({
  _id,
  title: initialTitle = '',
  cover: initialCover = '',
  userId
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [cover, setCover] = useState(initialCover);
  const [coverFile, setCoverFile] = useState(null);
  const navigate = useNavigate();

  function handleCoverChange(ev) {
    console.log(ev.target.files)
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCover(reader.result); // Set the cover state to the read data URL
      };
      reader.readAsDataURL(file);
      console.log(file)
      setCoverFile(file);
    }
  }

  async function savePlaylist(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('title', title);
    if (coverFile) {
      data.append('cover', coverFile);
    } else if (_id && !coverFile) {
      // If editing and no new file has been chosen, don't append a new cover key
      data.append('cover', initialCover);
    }

    try {
      let response;
      if (_id) {
        response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/playlists/${_id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/playlists', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      // If successful, redirect back
      if (response.status === 201 || response.status === 200) {
        navigate('/playlists');
      } else {
        throw new Error('Failed to save playlist');
      }
    } catch (error) {
      console.error('Upload error', error);
    }

  }

  return (
    <form onSubmit={savePlaylist} className="flex flex-col m-8">
      <h1 className="font-bold text-2xl mb-2">{_id ? t("editPlaylist") : t("newPlaylist")}</h1>

      <label className="text-lg my-2">{t("playlistName")}</label>
      <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
        placeholder={t("playlistName")} value={title} onChange={ev => setTitle(ev.target.value)} required />

      <label className="text-lg mt-2">{t("cover")}</label>
      {!cover ? (
        <label className="mt-2 border aspect-square size-36 rounded-lg flex flex-col items-center justify-center cursor-pointer text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>

          <input type="file" className="hidden" onChange={handleCoverChange} />
          {t("upload")}
        </label>
      ) :
        (
          <label className="mt-2 cursor-pointer relative w-36 h-36">
            <input type="file" className="hidden" onChange={handleCoverChange} />
            <img src={formatImageUrl(cover)} className="w-full h-full object-cover border rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="text-black font-semibold">{t("changeCover")}</span>
            </div>
          </label>
        )}

      <button type="submit" className="mr-auto mt-4 bg-orange-200 rounded-md py-1 px-2 hover:bg-orange-400">
        {_id ? t("update") : t("upload")}
      </button>

    </form>
  );
};