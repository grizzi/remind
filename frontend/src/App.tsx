import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import UserSettingsPage from './pages/UserSettings'
import EditSubscription from './pages/EditSubscription'
import ProtectedRoute from './components/ProtectedRoute'

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path='/settings' element={<UserSettingsPage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/register' element={<RegisterAndLogout />}></Route>
          <Route path='/edit' element={<EditSubscription />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
