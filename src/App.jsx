import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './pages/register'
import MainApps from './pages/MainApps'
import CreateUser from './pages/CreateUser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='mt-14 mx-auto max-w-6xl grid gap-y-5 lg:grid-cols-[60%_40%]'>
      <MainApps />
      {/* <Register /> */}
      <CreateUser />
    </div>
  )
}

export default App
