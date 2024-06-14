import { useParams } from "react-router-dom";
import PlaylistForm from "../../../components/PlaylistForm";
import axios from "axios";
import { useEffect, useState } from "react";


const EditPlaylist = () => {
  const { playlistId } = useParams();
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/playlists/${playlistId}`);
      if (response.status === 200) {
        setPlaylistData(response.data);
      }
    };

    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  return playlistData ? (
    <PlaylistForm {...playlistData} />
  ) : (
    <div>Loading...</div>
  );
};

export default EditPlaylist;
