import useSWR from 'swr';
import axios from 'axios';
import Tracklist from '../../components/Tracklist';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

const fetcher = url => axios.get(url).then(res => res.data);

const SearchResults = () => {
  const { q } = useParams();
  const { data: results, error } = useSWR(q ? import.meta.env.VITE_SERVER_URL + `/api/search?q=${q}` : null, fetcher);

  if (error) return <div>Failed to load results.</div>;
  if (!results) return null;

  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold">搜索结果</h1>
      <div className='px-8 mt-10'>
        {!!results.tracks.length && (
          <>
            <h2 className="text-lg font-semibold mt-4">音乐</h2>
            <Tracklist tracks={results.tracks} showFavoriteButton={false} />
          </>
        )}
        {!!results.users.length && (
          <>
            <h2 className="text-lg font-semibold mt-8 mb-8">用户</h2>
            {results.users.map(item =>
              <Link to={`/profile/${item._id}`} key={item._id} className="p-2 flex items-center">
                <img
                  src={import.meta.env.VITE_SERVER_URL + (item.avatar || '/assets/default-cover-1.png')}
                  alt="Avatar"
                  className="w-12 h-12 mr-6 rounded-md"
                />
                <h2 className="font-semibold ml-28">{item.name}</h2>
              </Link>)}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
