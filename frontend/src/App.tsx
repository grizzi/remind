import { AuthContextProvider } from './hooks/auth'
import AppContextProvider from './context'
import { Flip, ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <AuthContextProvider>
        <AppContextProvider>
          <Outlet />
          <ToastContainer
            position='bottom-center'
            pauseOnHover={false}
            transition={Flip}
            autoClose={2000}
            hideProgressBar={true}
            toastStyle={{
              margin: '10px',
              maxWidth: '300px',
            }}
          />
        </AppContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
