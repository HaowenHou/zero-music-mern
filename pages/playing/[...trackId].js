import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Playing() {
  const router = useRouter();
  const { trackId } = router.query;
  const [track, setTrack] = useState(null);

  useEffect(() => {
    if (!trackId) return;

    const fetchTrack = async () => {
      try {
        const response = await axios.get(`/api/tracks?id=${trackId}`);
        console.log(response.data);
        setTrack(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrack();
  }, [trackId]);

  if (!track) return null;

  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full flex items-center justify-center">
        <img src={track.cover} alt="cover" className="w-72 h-72 rounded-xl" />
      </div>
      <div className="w-1/2 pt-10 h-full">
        <h1 className="text-2xl font-semibold">{track.title}</h1>
        <h2 className="text-lg mt-4">歌手：{track.artist}</h2>
        <div className="flex items-center mt-4">
          <h2 className="text-lg">歌词：</h2>
          <Link href='/' className="ml-auto mr-16">
            <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </Link>
        </div>
        <div className="mt-4 h-96 flex flex-col items-center justify-center">
          {track.lyrics ? (
            track.lyrics.map((line, index) => (
              <p key={index} className="text-lg">{line}</p>
            ))
          ) : (
            <p className="text-lg my-auto">暂无歌词</p>
          )}
        </div>
      </div>
    </div>
  );
}