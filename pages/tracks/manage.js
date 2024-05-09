import axios from "axios";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function Manage() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    axios.get('/api/tracks').then((res) => {
      setTracks(res.data);
    })
  }, []);

  const handleDelete = async (id) => {
    // Confirm before proceeding
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        const response = await fetch(`/api/tracks?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert("Track deleted successfully!");
          axios.get('/api/tracks').then((res) => {
            setTracks(res.data);
          })
        } else {
          throw new Error('Failed to delete the track.');
        }
      } catch (error) {
        console.error("Error deleting track:", error);
        alert("There was a problem deleting the track.");
      }
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-2xl font-semibold">
        音乐管理
      </h1>
      <div className="m-4">
        <Link href="/tracks/new" className="m-2 ml-6 bg-orange-300 px-1.5 py-1.5 rounded-lg hover:bg-orange-400">上传</Link>
      </div>
      <table className="w-full ml-10">
        <tbody>
          {tracks.map((track) => (
            <tr key={track._id} className="gap-1 m-2 h-14">
              <td className="w-20">
                <img className="size-10 rounded-md" src={track.cover} alt={track.name} />
              </td>
              <td className="w-60">
                <h2>{track.name}</h2>
              </td>
              <td>
                <p>{track.artist}</p>
              </td>
              <td>
                <Link className="bg-white text-gray-800 px-2 mx-2 py-1 rounded-sm border border-gray-200 shadow-sm"
                  href={`/tracks/edit/${track._id}`}>
                  编辑
                </Link>
                {/* <Link className="bg-red-200 text-red-600 px-2 py-1 rounded-sm shadow-sm" href={'/tracks/delete/' + track._id}>
                  删除
                </Link> */}
                <button className="bg-red-200 text-red-600 px-2 py-1 rounded-sm shadow-sm"
                  onClick={() => handleDelete(track._id)}>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};