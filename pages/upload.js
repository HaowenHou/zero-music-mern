import { useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";

export default function Upload() {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [cover, setCover] = useState('');
  const [musicFile, setMusicFile] = useState(null); // State to hold the music file

  async function uploadCover(ev) {
    const file = ev.target.files[0];
    const data = new FormData();
    data.append('file', file);
    // const res = await axios.post('/api/uploadCover', data);
    const res = await fetch('/api/uploadCover', {
      method: 'POST',
      body: data
    });
    if (res.ok) {
      const responseJson = await res.json();
      setCover(responseJson.link);
    } else {
      console.error('HTTP error', res.status, await res.text());
    }
  }

  function handleMusicFileChange(ev) {
    setMusicFile(ev.target.files[0]); // Save the music file to state
    // console.log(ev.target.files[0]);
  }

  async function saveMusic(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('name', name);
    data.append('artist', artist);
    data.append('cover', cover);
    // console.log(musicFile);
    if (musicFile) {
      data.append('file', musicFile); // Append the music file to FormData
    }
    try {
      const response = await axios.post('/api/uploadMusic', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Upload error', error);
    }
    // const data = { name, artist, cover };
    // axios.post('/api/uploadMusic', data)
  }

  return (
    <Layout>
      <form onSubmit={saveMusic} className="flex flex-col m-8">
        <h1 className="font-bold text-2xl mb-2">上传音乐</h1>

        <label className="text-lg my-2">歌曲名</label>
        <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
          placeholder="歌曲名" value={name} onChange={ev => setName(ev.target.value)} required />

        <label className="text-lg my-2">歌手</label>
        <input type="text" className="border w-64 p-1 rounded-md focus:border-orange-200"
          placeholder="歌手" value={artist} onChange={ev => setArtist(ev.target.value)} required />

        {!cover ? (
          <label className="mt-4 border aspect-square size-36 rounded-lg flex flex-col items-center justify-center cursor-pointer text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>

            <input type="file" className="hidden" onChange={uploadCover} />
            上传封面
          </label>
        ) :
          (
            <label className="mt-4 cursor-pointer relative w-36 h-36">
              <input type="file" className="hidden" onChange={uploadCover} />
              <img src={cover} className="w-full h-full object-cover border rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-black font-semibold">更换封面</span>
              </div>
            </label>
          )}

        <label className="text-lg my-2">音乐文件</label>
        <input type="file" onChange={handleMusicFileChange} />

        <button type="submit" className="mr-auto mt-4 bg-orange-200 rounded-md py-1 px-2 hover:bg-orange-400">
          上传
        </button>

      </form>
    </Layout >
  );
}