import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Calendar from './pages/Calendar'

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
    <div className='flex flex-row'>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route
            path='/'
            element={
              // <ProtectedRoute>
              <Home />
              // </ProtectedRoute>
            }
          />
          <Route path='/overview' element={<Overview />}></Route>
          <Route path='/calendar' element={<Calendar />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/register' element={<RegisterAndLogout />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
