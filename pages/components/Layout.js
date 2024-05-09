import Sidebar from './Sidebar'
import SearchBar from './TopBar'
import PlayerControl from './PlayerControl'

const Layout = ({ tracks, index, children }) => {
  if (!tracks || tracks.length === 0) {
    tracks = [
      {
        id: 1,
        title: 'Stars In Her Eyes',
        artist: 'Panz',
        file: '/tracks/Stars In Her Eyes - Panz.mp3',
        cover: '/albums/4.png'
      },
      {
        id: 2,
        title: 'Golden Sunshine',
        artist: 'Zack Brown',
        file: '/tracks/Golden Sunshine - Zack Brown.mp3',
        cover: '/albums/5.png'
      },
      {
        id: 3,
        title: 'Stone',
        artist: 'Oliver McCann',
        file: '/tracks/Stone - Oliver McCann.mp3',
        cover: '/albums/6.png'
      },
      {
        id: 4,
        title: 'What Really matters',
        artist: 'Oliver McCann',
        file: '/tracks/What Really matters - Oliver McCann.mp3',
        cover: '/albums/7.png'
      }
    ];
  }
  return (
    <div className='flex flex-col'>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col">
          <SearchBar />
          <div className="content">{children}</div>
        </div>
      </div>

      {/* {console.log('Playing playlist from Layout', tracks, index)} */}
      <PlayerControl tracks={tracks} index={index} />
    </div>
  )
}

export default Layout;