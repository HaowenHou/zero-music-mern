// pages/playlists/[id].js
import { useRouter } from "next/router";
import PlaylistForm from "../../components/PlaylistForm";
import axios from "axios";
import { useEffect, useState } from "react";

const EditPlaylist = () => {
  const router = useRouter();
  const { id } = router.query;
  const [playlistData, setPlaylistData] = useState(null);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      const response = await axios.get(`/api/playlist?id=${id}`);
      if (response.status === 200) {
        setPlaylistData(response.data);
      }
    };

    if (id) {
      fetchPlaylistData();
    }
  }, [id]);

  return playlistData ? (
    <PlaylistForm {...playlistData} />
  ) : (
    <div>Loading...</div>
  );
};

export default EditPlaylist;
