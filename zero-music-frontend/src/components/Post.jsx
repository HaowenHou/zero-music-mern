import { formatTime } from "../utils/timeUtils";
import { useDispatch } from 'react-redux';
import { setPlaylist, setTrackIndex, setPlay, setCurrentTrackId } from "../redux/actionCreators";

export default function Post({ post, manageMode = false, handleDelete }) {
  const dispatch = useDispatch();
  if (!post) return null;
  const track = post.trackId;

  const onPlayClick = () => {
    const tracks = [track];
    const index = 0;
    dispatch(setPlay(false));
    dispatch(setPlaylist(tracks));
    dispatch(setTrackIndex(index));
    dispatch(setPlay(true));
    dispatch(setCurrentTrackId(track._id));
  }; // This affects other components

  return (
    <div className="rounded-xl bg-gray-50 flex flex-col">
      <div className="flex m-2 items-center">
        <img className="h-12 w-12 rounded-lg" src={import.meta.env.VITE_SERVER_URL + post.userId.avatar} alt="avatar" />
        <div className="flex flex-col ml-4">
          <h2 className="font-semibold text-lg">{post.userId.name}</h2>
          <span className="text-sm text-gray-500">
            {convertTimestamp(post.timestamp)}
          </span>
        </div>
        {manageMode && (
          <button onClick={() => handleDelete(post._id)} className="ml-auto mr-4">
            <svg className="size-6 stroke-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        )}
      </div>
      <p className="m-4">{post.content}</p>
      {post.trackId && (
        <div className="flex rounded-lg bg-gray-100 items-center m-2">
          <img className="w-12 h-12 rounded-lg m-2" src={import.meta.env.VITE_SERVER_URL + track.cover} alt="cover" />
          <p className="m-2">{track.title} - {track.artist}</p>
          <button onClick={onPlayClick} className="ml-auto mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-gray-800">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
            </svg>
          </button>

          <p className="mr-4">{formatTime(track.duration)}</p>
        </div>
      )}
    </div>
  );
}

const convertTimestamp = (timestamp) => {
  // Format into yyyy-mm-dd hh:mm
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}-${month}-${day} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}