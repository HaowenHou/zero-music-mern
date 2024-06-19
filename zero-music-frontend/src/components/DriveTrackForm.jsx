import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { formatImageUrl } from "../utils/url";

export default function DriveTrackForm({
  _id,
  userId,
  title: initialTitle = '',
  artist: initialArtist = '',
  cover: initialCover = '',
  track: initialTrack = '' // URI to the track
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [artist, setArtist] = useState(initialArtist);
  const [cover, setCover] = useState(initialCover);
  const [coverFile, setCoverFile] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const [trackChanged, setTrackChanged] = useState(false);
  const navigate = useNavigate();

  function handleCoverChange(ev) {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCover(reader.result); // Set the cover state to the read data URL
      };
      reader.readAsDataURL(file);
      setCoverFile(file);
    }
  }

  function handleMusicFileChange(ev) {
    setMusicFile(ev.target.files[0]);
    setTrackChanged(true);
  }

  async function saveMusic(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('artist', artist);
    if (coverFile) {
      data.append('cover', coverFile);
    }
    if (musicFile) {
      data.append('track', musicFile);
    }

    if (_id) {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/drive/${_id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // If successful, redirect to the track page
        if (response.status === 201 || response.status === 200) {
          navigate('/drive/manage');
        } else {
          throw new Error('Failed to save music');
        }
      } catch (error) {
        console.error('Upload error', error);
      }
    } else {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/drive', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        // If successful, redirect to the track page
        if (response.status === 201 || response.status === 200) {
          navigate('/drive/manage');
        } else {
          throw new Error('Failed to save music');
        }
      } catch (error) {
        console.error('Upload error', error);
      }
    }

  }

  return (
    <form onSubmit={saveMusic} className="flex flex-col m-8">
      <h1 className="font-bold text-2xl mb-2">{t("uploadMusic")}</h1>

      <label className="text-lg my-2">{t("musicTitle")}</label>
      <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
        placeholder={t("musicTitle")} value={title} onChange={ev => setTitle(ev.target.value)} required />

      <label className="text-lg my-2">{t("artist")}</label>
      <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
        placeholder={t("artist")} value={artist} onChange={ev => setArtist(ev.target.value)} required />

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

      <label className="text-lg my-2">{t("musicFile")}</label>
      <input className="mb-2" type="file" onChange={handleMusicFileChange} />

      {initialTrack && !trackChanged && (
        <div className="my-2 w-4/6">
          <audio controls src={import.meta.env.VITE_SERVER_URL + initialTrack} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <button type="submit" className="mr-auto mt-4 bg-orange-200 rounded-md py-1 px-2 hover:bg-orange-400">
        {t("upload")}
      </button>

    </form>
  );
};