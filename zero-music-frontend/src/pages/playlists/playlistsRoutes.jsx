import { Route } from "react-router-dom";
import Playlists from ".";
import Playlist from "./[playlistId]";
import NewPlaylist from "./new";
import EditPlaylist from "./edit/[id]";

const PlaylistsRoutes = (
  <>
    <Route path="playlists" element={<Playlists />} />
    <Route path="playlists/:playlistId" element={<Playlist />} />
    <Route path="playlists/new" element={<NewPlaylist />} />
    <Route path="playlists/edit/:playlistId" element={<EditPlaylist />} />
  </>
);

export default PlaylistsRoutes;