import { Route } from "react-router-dom";
import EditTrack from "./edit/[trackId]";
import Manage from "./manage";
import New from "./new";

const TracksRoutes = (
  <>
    <Route path="tracks/edit/:trackId" element={<EditTrack />} />
    <Route path="tracks/manage" element={<Manage />} />
    <Route path="tracks/new" element={<New />} />
  </>
);

export default TracksRoutes;