import { useState, useEffect } from "react";
import TrackItem from "./TrackItem";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPlaylist, setTrackIndex, setPlay, setCurrentTrackId } from "../redux/actionCreators";

export default function Tracklist({
  tracks: initialTracks,
  showFavoriteButton,
  userId,
  manageMode = false,
  handleRemoveFromPlaylist
}) {
  const [tracks, setTracks] = useState(initialTracks);
  const dispatch = useDispatch();
  const [inElectron, setInElectron] = useState(false);

  useEffect(() => {
    if (window.electron !== undefined) {
      setInElectron(true);
    }
  }, []);

  // Listen for the context menu action response
  useEffect(() => {
    if (!inElectron) return;
    const handleMenuActionResponse = async (menuResopnse) => {
      try {
        const { playlistId, trackId } = menuResopnse;
        const apiResponse = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/playlists/${playlistId}/tracks`, { trackId });
      } catch (error) {
        console.error('Error adding track to playlist:', error);  // Handle errors
      }
    };

    window.electron.onMenuActionResponse(handleMenuActionResponse);

    return () => {
      window.electron.offMenuActionResponse(handleMenuActionResponse);
    };
  }, [inElectron]);

  // When right clicked on a track item, show the context menu
  const handleContextMenu = async (event, trackId) => {
    if (!inElectron) return;
    console.log(event);
    event.preventDefault();

    const { data: playlists } = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/users/${userId}/playlists`);
    const menuItems = playlists.map((playlist) => ({
      label: playlist.title,
      playlistId: playlist._id,
      trackId: trackId
    }));

    window.electron.invokeContextMenu(menuItems);
  };

  useEffect(() => {
    setTracks(initialTracks);
  }, [initialTracks]);

  const toggleFavorite = async (trackId) => {
    if (!showFavoriteButton) return;

    // Check whether the track is already favorited
    const track = tracks.find((track) => track._id === trackId);
    if (track.isFavorited) {
      // Remove from favorites
      try {
        await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/favorites/${trackId}`);
        const updatedTracks = tracks.map((track) =>
          (track._id === trackId) ? { ...track, isFavorited: !track.isFavorited } : track
        );
        setTracks(updatedTracks);
      } catch (error) {
        console.error('Error removing from favorites', error);
      }
    } else {
      // Add to favorites
      try {
        await axios.post(import.meta.env.VITE_SERVER_URL + `/api/favorites`, { trackId });
        const updatedTracks = tracks.map((track) =>
          (track._id === trackId) ? { ...track, isFavorited: !track.isFavorited } : track
        );
        setTracks(updatedTracks);
      } catch (error) {
        console.error('Error adding to favorites', error);
      }
    }
  }

  const onPlayClick = (tracks, index) => {
    dispatch(setPlay(false));
    dispatch(setPlaylist(tracks));
    dispatch(setTrackIndex(index));
    dispatch(setCurrentTrackId(tracks[index]._id));
    dispatch(setPlay(true));
  };

  return (
    <div className="mt-8">
      {tracks && !!tracks.length && tracks.map((track, index) => (
        <TrackItem
          key={track._id}
          track={track}
          onPlayClick={() => onPlayClick(tracks, index)}
          showFavoriteButton={showFavoriteButton}
          onFavoriteClick={() => toggleFavorite(track._id)}
          handleContextMenu={handleContextMenu}
          manageMode={manageMode}
          handleRemoveFromPlaylist={() => handleRemoveFromPlaylist(track._id)}
        />
      ))}
    </div>
  );
}