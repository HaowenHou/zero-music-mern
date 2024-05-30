import { useState, useEffect } from "react";
import TrackItem from "./TrackItem";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPlaylist, setTrackIndex, setPlay } from "@/store/actionCreators";

export default function Tracklist({ tracks: initialTracks, showFavoriteButton, userId }) {
  const [tracks, setTracks] = useState(initialTracks);
  const dispatch = useDispatch();

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  const toggleFavorite = async (trackId) => {
    if (!showFavoriteButton) return;

    try {
      await axios.post(`/api/favorites?id=${trackId}&userId=${userId}`);
      const updatedTracks = tracks.map((track) =>
        (track._id === trackId) ? { ...track, favorite: !track.favorite } : track
      );
      setTracks(updatedTracks);
    } catch (error) {
      console.error('Error toggling favorite status', error);
    }
  }

  const onPlayClick = (tracks, index) => {
    dispatch(setPlaylist(tracks));
    dispatch(setTrackIndex(index));
    dispatch(setPlay(true));
  };

  return (
    <div className="mt-8">
      {tracks.length > 0 && tracks.map((track, index) => (
        <TrackItem
          key={track._id}
          track={track}
          onPlayClick={() => onPlayClick(tracks, index)}
          showFavoriteButton={showFavoriteButton}
          onFavoriteClick={() => toggleFavorite(track._id)}
        />
      ))}
    </div>
  );
}