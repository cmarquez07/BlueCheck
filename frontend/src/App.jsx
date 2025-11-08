import { useState } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { Header } from './components/Header'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <AppRoutes />
    </>
  )
}

export default App
