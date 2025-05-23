import { AuthContextProvider } from './hooks/auth'
import AppContextProvider from './context'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <AuthContextProvider>
        <AppContextProvider>
          <Outlet />
          <ToastContainer />
        </AppContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
