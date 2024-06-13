import PlaylistForm from "../../components/PlaylistForm";
import { useSelector } from "react-redux";

export default function NewPlaylist() {
  const { userId } = useSelector((state) => state.userState);

  return (
    <div>
      {userId && <PlaylistForm userId={userId} />}
    </div>
  );
}