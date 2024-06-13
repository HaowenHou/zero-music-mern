import { Route } from "react-router-dom";
import Posts from ".";
import New from "./new";

const PostsRoutes = (
  <>
    <Route path="posts" element={<Posts />} />
    <Route path="posts/new" element={<New />} />
  </>
);

export default PostsRoutes;