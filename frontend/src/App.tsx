import SiteLayout from './components/SiteLayout'
import { AuthContextProvider } from './hooks/auth'
import AppContextProvider from './context'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <AuthContextProvider>
        <AppContextProvider>
          <SiteLayout />
          <ToastContainer />
        </AppContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
