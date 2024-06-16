import { Route } from "react-router-dom";
import UserDrive from ".";
import Manage from "./manage";
import New from "./new";
import EditTrack from "./edit/[trackId]";

const DriveRoutes = (
  <>
    <Route path="drive" element={<UserDrive />} />
    <Route path="drive/manage" element={<Manage />} />
    <Route path="drive/new" element={<New />} />
    <Route path="drive/edit/:trackId" element={<EditTrack />} />
  </>
);

export default DriveRoutes;