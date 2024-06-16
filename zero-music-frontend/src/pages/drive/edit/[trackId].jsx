import TrackForm from "../../../components/TrackForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditTrack() {
  const { trackId } = useParams();
  const [trackInfo, setTrackInfo] = useState(null);

  useEffect(() => {
    if (!trackId) {
      return;
    }
    axios.get(import.meta.env.VITE_SERVER_URL + `/api/drive/${trackId}`).then(res =>{
      setTrackInfo(res.data);
    })
  }, [trackId]);

  return (
    <>
      {trackInfo && <TrackForm {...trackInfo} inDrive={true}></TrackForm>}
    </>
  );
};