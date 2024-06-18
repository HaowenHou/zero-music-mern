import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Manage() {
  const { t } = useTranslation();
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

  const handleDelete = async (id) => {
    // Confirm before proceeding
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/drive/${id}`);
        setTracks((currentTracks) => currentTracks.filter((track) => track._id !== id));
      } catch (error) {
        console.error("Error deleting track:", error);
        alert("There was a problem deleting the track.");
      }
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-2xl font-semibold">
        {t("driveManagement")}
      </h1>
      <div className="m-4">
        <Link to="/drive/new" className="m-2 ml-6 bg-orange-300 px-1.5 py-1.5 rounded-lg hover:bg-orange-400">上传</Link>
        <Link to="/drive" className="m-2 bg-orange-300 px-1.5 py-1.5 rounded-lg hover:bg-orange-400">完成</Link>
      </div>
      <table className="w-full ml-10">
        <tbody>
          {!!tracks.length && tracks.map((track) => (
            <tr key={track._id} className="gap-1 m-2 h-14">
              <td className="w-20">
                <img className="size-10 rounded-md" src={import.meta.env.VITE_SERVER_URL + track.cover} alt={track.title} />
              </td>
              <td className="w-60">
                <h2>{track.title}</h2>
              </td>
              <td>
                <p>{track.artist}</p>
              </td>
              <td>
                <Link className="bg-white text-gray-800 px-2 mx-2 py-1 rounded-sm border border-gray-200 shadow-sm"
                  to={`/tracks/edit/${track._id}`}>
                  {t("edit")}
                </Link>
                <button className="bg-red-200 text-red-600 px-2 py-1 rounded-sm shadow-sm"
                  onClick={() => handleDelete(track._id)}>
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};