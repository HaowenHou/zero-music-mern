import { useState, useEffect } from "react";
import TrackItem from "./TrackItem";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPlaylist, setTrackIndex, setPlay } from "@/store/actionCreators";

export default function Tracklist({
  tracks: initialTracks,
  showFavoriteButton,
  userId,
  manageMode = false,
  handleRemoveFromPlaylist
}) {

  const [tracks, setTracks] = useState(initialTracks);
  const dispatch = useDispatch();

  // Listen for the context menu action response
  useEffect(() => {
    const handleMenuActionResponse = async (menuResopnse) => {
      try {
        console.log('Menu action response:', menuResopnse);
        const { playlistId, trackId } = menuResopnse;
        const apiResponse = await axios.patch(`/api/playlist?playlistId=${playlistId}&trackId=${trackId}`);
        console.log('Track added:', apiResponse.data);  // Handle success
      } catch (error) {
        console.error('Error adding track to playlist:', error);  // Handle errors
      }
    };

    window.electron.onMenuActionResponse(handleMenuActionResponse);

    return () => {
      window.electron.offMenuActionResponse(handleMenuActionResponse);
    };
  }, []);

  // When right clicked on a track item, show the context menu
  const handleContextMenu = async (event, trackId) => {
    console.log(event);
    event.preventDefault();

    const response = await axios.get(`/api/playlist/${userId}`);
    const playlists = response.data.playlists;
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