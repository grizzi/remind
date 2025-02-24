import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Summary from './pages/Summary'
import Configure from './pages/Configure'

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

/**
 * TODO(giuseppe)
 * We have to put everything back in protected routes using
 * this trick
 * import ProtectedRoute from './components/ProtectedRoute'
 *
 * <ProtectedRoute>
 *   <Home />
 *  </ProtectedRoute>
 * @returns
 */
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/register' element={<RegisterAndLogout />}></Route>
          <Route path='/summary' element={<Summary />}></Route>
          <Route path='/configure' element={<Configure />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
