import { setPlay, setTrackIndex, setCurrentTrackId, setPlaylist } from '../redux/actionCreators';

const handlePlayPlaylist = (dispatch, tracks) => {
  if (!tracks.length) return;
  dispatch(setPlay(false));
  dispatch(setPlaylist(tracks));
  dispatch(setTrackIndex(0));
  dispatch(setCurrentTrackId(tracks[0]._id));
  dispatch(setPlay(true));
}

export { handlePlayPlaylist };