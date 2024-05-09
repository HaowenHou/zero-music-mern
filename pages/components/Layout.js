import Sidebar from './Sidebar'
import SearchBar from './TopBar'
import PlayerControl from './PlayerControl'
import store from '@/store/store';
import { Provider } from 'react-redux'

const Layout = ({ children }) => {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default Layout;