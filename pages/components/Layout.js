import Sidebar from './Sidebar'
import SearchBar from './TopBar'
import PlayerControl from './PlayerControl'

const Layout = ({ children }) => {
  return (
    <div className='flex flex-col'>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col">
          <SearchBar />
          <div className="content">{children}</div>
        </div>
      </div>
      <PlayerControl />
    </div>
  )
}

export default Layout;