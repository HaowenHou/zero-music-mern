import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function PlaylistForm({
  _id,
  title: initialTitle = '',
  cover: initialCover = '',
  userId
}) {
  const [title, setTitle] = useState(initialTitle);
  const [cover, setCover] = useState(initialCover);
  const [coverFile, setCoverFile] = useState(null);
  const router = useRouter();

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

  async function savePlaylist(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('title', title);
    data.append('userId', userId);
    if (coverFile) {
      data.append('cover', coverFile);
    }

    try {
      let response;
      if (_id) {
        response = await axios.put(`/api/playlist/${_id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('/api/playlist', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      // If successful, redirect back
      if (response.status === 201 || response.status === 200) {
        router.push('/playlists');
      } else {
        throw new Error('Failed to save playlist');
      }
    } catch (error) {
      console.error('Upload error', error);
    }

  }

  return (
    <form onSubmit={savePlaylist} className="flex flex-col m-8">
      <h1 className="font-bold text-2xl mb-2">新建歌单</h1>

      <label className="text-lg my-2">歌单名</label>
      <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
        placeholder="歌曲名" value={title} onChange={ev => setTitle(ev.target.value)} required />

      <label className="text-lg mt-2">封面</label>
      {!cover ? (
        <label className="mt-2 border aspect-square size-36 rounded-lg flex flex-col items-center justify-center cursor-pointer text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>

          <input type="file" className="hidden" onChange={handleCoverChange} />
          上传
        </label>
      ) :
        (
          <label className="mt-2 cursor-pointer relative w-36 h-36">
            <input type="file" className="hidden" onChange={handleCoverChange} />
            <img src={cover} className="w-full h-full object-cover border rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="text-black font-semibold">更换封面</span>
            </div>
          </label>
        )}

      <button type="submit" className="mr-auto mt-4 bg-orange-200 rounded-md py-1 px-2 hover:bg-orange-400">
        上传
      </button>

    </form>
  );
};