import TrackForm from "@/pages/components/TrackForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditTrack() {
  const router = useRouter();
  const { id } = router.query;
  const [trackInfo, setTrackInfo] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/tracks?id=' + id).then(res =>{
      setTrackInfo(res.data);
    })
  }, [id]);

  return (
    <>
      {trackInfo && <TrackForm {...trackInfo}></TrackForm>}
    </>
  );
};