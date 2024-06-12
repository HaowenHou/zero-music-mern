import Sidebar from './Sidebar'
import TopBar from './TopBar'
import PlayerControl from './PlayerControl'
import store from '@/store/store';
import { Provider } from 'react-redux'

const Layout = ({ children }) => {
  return (
    <Provider store={store}>
      <div className='flex flex-col h-screen'>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <TopBar />
            <div className="h-full overflow-auto">{children}</div>
          </div>
        </div>
        <PlayerControl />
      </div>
    </Provider>
  )
}

export default Layout;