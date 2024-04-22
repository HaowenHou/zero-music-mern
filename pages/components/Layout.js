import Sidebar from './Sidebar'
import SearchBar from './TopBar'

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content">
        <SearchBar />
        <div className="content">{children}</div>
      </div>
      {/* <PlayerControl /> */}
    </div>
  )
}

export default Layout;