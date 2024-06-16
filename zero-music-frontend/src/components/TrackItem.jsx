import { formatTime } from "../utils/timeUtils";

export default function TrackItem({
  track,
  onPlayClick,
  showFavoriteButton,
  onFavoriteClick,
  handleContextMenu,
  manageMode = false,
  handleRemoveFromPlaylist
}) {
  if (!track) return null;
  return (
    <div className="flex items-center p-2 my-2 rounded-lg hover:bg-gray-50" onContextMenu={event => handleContextMenu(event, track._id)}>
      <div className="flex-[3.5]">
        <img
          src={import.meta.env.VITE_SERVER_URL + (track.cover || '/assets/default-cover-1.png')}
          alt="Album Cover"
          className="w-12 h-12 mr-6 rounded-md"
        />
      </div>
      <div className='w-64 flex-[6]'>
        <h2 className="font-semibold ml-6">{track.title}</h2>
      </div>
      <p className='flex-[4.5]'>{track.artist}</p>
      <div className="flex-[2] flex items-center">
        <span className="mr-3 ml-auto">{formatTime(track.duration)}</span>
        {manageMode ? (
          <button onClick={handleRemoveFromPlaylist}>
            <svg className="size-7 p-1 stroke-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        ) : (
          <>
            {showFavoriteButton &&
              <button onClick={() => onFavoriteClick(track._id)}>
                {track.isFavorited ? (
                  <svg className="rounded-full size-8 p-1 pt-1.5 bg-opacity-90 fill-orange-400 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                ) : (
                  <svg className="rounded-full size-8 p-1 pt-1.5 bg-opacity-90 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )}
              </button>
            }
            <button onClick={onPlayClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 p-1.5 fill-orange-400">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}