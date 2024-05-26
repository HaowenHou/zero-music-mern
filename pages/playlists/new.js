import PlaylistForm from "../components/PlaylistForm";
import { useSession } from 'next-auth/react';

export default function New() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <div>
      {userId && <PlaylistForm userId={userId} />}
    </div>
  );
}