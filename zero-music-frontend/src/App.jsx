import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlayerControl from './components/PlayerControl'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
      <div className='flex flex-col h-screen'>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col w-full">
            <TopBar />
            <div className="h-full overflow-auto"></div>
          </div>
        </div>
        <PlayerControl />
      </div>
    </>
  )
}

export default App
