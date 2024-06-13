import { Route } from "react-router-dom";
import UserDrive from ".";
import Manage from "./manage";
import New from "./new";

const DriveRoutes = (
  <>
    <Route path="drive" element={<UserDrive />} />
    <Route path="drive/manage" element={<Manage />} />
    <Route path="drive/new" element={<New />} />
  </>
);

export default DriveRoutes;