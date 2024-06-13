import DriveTrackForm from "../../components/DriveTrackForm";
import { useSelector } from "react-redux";

export default function New() {
  const { userId } = useSelector((state) => state.userState);
  return (
    <DriveTrackForm userId={userId} />
  );
}