import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Playing() {
  const navigate = useNavigate();
  const { trackId } = router.query;
  const [track, setTrack] = useState(null);
  const [comments, setComments] = useState([]);
  const [showing, setShowing] = useState('lyrics');
  const [content, setContent] = useState('');

  const { userId } = useSelector((state) => state.userState);

  useEffect(() => {
    if (!trackId) return;

    const fetchTrack = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/tracks?id=${trackId}`);
        console.log(response.data);
        setTrack(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrack();
  }, [trackId]);

  const handleContentChange = () => {
    if (showing === 'lyrics') {
      fetchComments();
    }

    setShowing(showing === 'lyrics' ? 'comments' : 'lyrics');
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/comments/${trackId}`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const postComment = async () => {
    try {
      await axios.post(import.meta.env.VITE_SERVER_URL + `/api/comments/${trackId}`, { userId, content, timestamp: new Date() });
      setContent('');
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  }

  const showContent = () => {
    if (showing === 'lyrics') {
      return (
        <>
          <h2 className="text-lg mt-4">歌词：</h2>
          <div className="mt-4 h-96 flex flex-col items-center justify-center">
            {track.lyrics ? (
              track.lyrics.map((line, index) => (
                <p key={index} className="text-lg">{line}</p>
              ))
            ) : (
              <p className="text-lg my-auto">暂无歌词</p>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <h2 className="text-lg mt-4">评论：</h2>
          <div className="mt-4 h-80 flex flex-col overflow-auto mr-6">
            {comments.length ? (
              comments.map((comment) => (
                <div key={comment._id} className='flex space-x-2'>
                  <div>
                    <Link to={`/profile/${comment.userId._id}`}>
                      <img src={import.meta.env.VITE_SERVER_URL + comment.userId.avatar} alt="Avatar" className="w-9 h-9 rounded-full ml-2" />
                    </Link>
                  </div>
                  <div className="flex flex-col items-start">
                    <div>
                      <span>{comment.userId.name}</span>
                      <span className="text-sm ml-2">{convertTimestamp(comment.timestamp)}</span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg max-w-xs break-words px-3 mt-1 mb-3" style={{ wordWrap: 'break-word' }}>
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-lg my-auto">暂无评论</p>
            )}
          </div>
          <div className="flex mt-4 w-full">
            <textarea value={content} onChange={e => setContent(e.target.value)}
              className="p-2 rounded-xl w-full" placeholder="输入评论..." />
            <button onClick={postComment} className="ml-4 mr-6 px-4 py-2 bg-orange-400 text-white rounded-xl">发表</button>
          </div>
        </>
      );
    }
  };

  if (!track) return null;

  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full flex items-center justify-center">
        <img src={import.meta.env.VITE_SERVER_URL + track.cover} alt="cover" className="w-72 h-72 rounded-xl" />
      </div>
      <div className="w-1/2 pt-10 h-full">
        <h1 className="text-2xl font-semibold">{track.title}</h1>
        <div className="flex items-center mt-4">
          <h2 className="text-lg">歌手：{track.artist}</h2>
          <button onClick={handleContentChange} className="ml-auto mr-16">
            {showing === 'lyrics' ? (
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            ) : (
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            )}
          </button>
        </div>
        {showContent()}
      </div>
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