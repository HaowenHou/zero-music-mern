import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length >= 2) { // Only search if query length >= 2 for performance
      const data = await onSearch(value);
      setResults(data);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleBlur = () => {
    // Hide results when user clicks away from the search bar
    setTimeout(() => setShowResults(false), 200); // Delay to allow click on results
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search/${query}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative flex">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onBlur={handleBlur}
          placeholder={t("searchPrompt")}
          className="h-9 w-64 px-4 py-1 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-400"
        />
        {showResults && !!results.tracks.length && (
          <div className="absolute left-0 right-0 top-8 mt-1 bg-white shadow-lg z-10 flex flex-col rounded-lg ">
            {results.tracks.map((item, index) => (
              <Link to={`/search/${item.title}`} key={index} className="w-full p-2 hover:bg-gray-100 rounded-lg">
                {item.title}
              </Link>
            ))}
          </div>
        )}
        <button type="submit" className='ml-1'>
          <svg className="size-4 ml-1 w-6 h-6 stroke-2 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
