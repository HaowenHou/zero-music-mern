import { formatTime } from "@/utils/timeUtils";

export default function TrackItem({
  track,
  onPlayClick,
  showFavoriteButton,
  onFavoriteClick
}) {
  return (
    <div className="flex items-center mb-6">
      <img
        src={track.cover || '/assets/default-cover-1.png'}
        alt="Album Cover"
        className="w-12 h-12 mr-6 rounded-md"
      />
      <div className='flex'>
        <div className='w-64'>
          <h2 className="font-semibold ml-6">{track.title}</h2>
        </div>
        <p className=''>{track.artist}</p>
      </div>
      <span className="ml-auto mr-3">{formatTime(track.duration)}</span>
      {showFavoriteButton &&
        <button onClick={() => onFavoriteClick(track._id)}>
          {track.favorite ? (
            <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90 fill-orange-400 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          ) : (
            <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
    </div>
  );
}