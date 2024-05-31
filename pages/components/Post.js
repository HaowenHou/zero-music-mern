import { formatTime } from "@/utils/timeUtils";

export default function Post({ post }) {
  const track = post.trackId;
  return (
    <div className="rounded-xl bg-gray-50 flex flex-col">
      <div className="flex m-2">
        <img className="h-12 w-12 rounded-lg" src={post.userId.avatar} alt="avatar" />
        <div className="flex flex-col ml-4">
          <h2 className="font-semibold text-lg">{post.userId.name}</h2>
          <span>
            {convertTimestamp(post.timestamp)}
          </span>
        </div>
      </div>
      <p className="m-4">{post.content}</p>
      {post.trackId && (
        <div className="flex rounded-lg bg-gray-100 items-center m-2">
          <img className="w-12 h-12 rounded-lg m-2" src={track.cover} alt="cover" />
          <p className="m-2">{track.title} - {track.artist}</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 fill-gray-800 ml-auto mr-2">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
          </svg>

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
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}