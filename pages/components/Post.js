import { formatTime } from "@/utils/timeUtils";

export default function Post({ userName, avatar, post, track }) {
  return (
    <div className="rounded-xl bg-gray-50">
      <div className="flex">
        <img className="h-12 w-12 rounded-lg" src={avatar} alt="avatar" />
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg">{userName}</h2>
          <span>
            {convertTimestamp(post.timestamp)}
          </span>
        </div>
        <p>{post.content}</p>
        {post.trackId && (
          <div className="flex rounded-lg bg-gray-100">
            <img src={track.cover} alt="cover" />
            <p>{track.title}</p>
            <p>{track.artist}</p>
            {/* svg */}
            <p>{formatTime(track.duration)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const convertTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString();
}