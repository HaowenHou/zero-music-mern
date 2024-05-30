import DriveTrackForm from "../components/DriveTrackForm";
import { useSession } from 'next-auth/react';

export default function New() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  if (status === 'loading') {
    return null;
  }

  return (
    <DriveTrackForm userId={userId} />
  );
}