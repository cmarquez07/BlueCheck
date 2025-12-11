import { AppRoutes } from './routes/AppRoutes'
import { Header } from './components/Header'
import { Toaster } from 'react-hot-toast';


export default function App() {

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
