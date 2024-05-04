import Sidebar from './Sidebar'
import SearchBar from './TopBar'
import PlayerControl from './PlayerControl'

const Layout = ({ children }) => {
  const tracks = [
    { file: 'tracks/Stars In Her Eyes.mp3' },
    { file: 'tracks/banbado_piano.mp3' },
  ]
  return (
    <div className='flex flex-col'>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col">
          <SearchBar />
          <div className="content">{children}</div>
        </div>
      </div>
      <PlayerControl tracks={tracks} />
    </div>
  )
}

export default Layout;