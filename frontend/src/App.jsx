import { useState } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { Header } from './components/Header'
import { Toaster } from 'react-hot-toast';


export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Toaster position="bottom-center" />
    </>
  )
}
