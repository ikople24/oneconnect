import { useState } from 'react'
import { Button } from "@/components/ui/button"

import AppRoutes from './routes/AppRoutes'

 './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
