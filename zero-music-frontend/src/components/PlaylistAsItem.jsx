import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function PlaylistAsItem({
  playlist,
  manageMode,
  onDelete,
  showFavorite = false,
  onFavoriteClick
}) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/playlists/edit/${playlist._id}`);
  };

  if (!playlist) return null;

  return (
    <div className="playlist-item flex items-center p-2 my-2 rounded-lg hover:bg-gray-50">
      <Link to={`/playlists/${playlist._id}`} className='flex-[3.5]'>
        <img
          src={import.meta.env.VITE_SERVER_URL + (playlist.cover || '/assets/default-cover-1.png')}
          alt="Playlist Cover"
          className="w-12 h-12 mr-6 rounded-md"
        />
      </Link>
      <div className='flex flex-[6] justify-center'>
        <div className='w-64'>
          <h2 className="font-semibold ml-6">{playlist.title}</h2>
        </div>
      </div>
      <div className='flex flex-[4.5] justify-center'>
        <div className='w-64'>
          <h2 className="font-semibold ml-6">{playlist.userId.name}</h2>
        </div>
      </div>
      <div className='flex-[2]'>
        <div className='flex items-center'>
          <div className='ml-auto'></div>
          {manageMode ? (
            <>
              <button onClick={handleEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 p-1.5 fill-orange-400">
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
              </button>
              <button onClick={() => onDelete(playlist._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 p-1.5 fill-orange-400">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {showFavorite &&
                <button onClick={() => onFavoriteClick(playlist._id)}>
                  {playlist.isFavorited ? (
                    <svg className="bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90 fill-orange-400 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  ) : (
                    <svg className=" bg-white rounded-full size-8 p-1 pt-1.5 bg-opacity-90 stroke-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  )}
                </button>
              }
              <button onClick={() => { }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-auto size-9 p-1.5 fill-orange-400">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}