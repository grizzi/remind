import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import SubscriptionsPage from './pages/SubscriptionsPage'
import NotFound from './pages/NotFound'
import UserSettingsPage from './pages/UserSettingsPage'
import SiteLayout from './components/SiteLayout'
import SubscriptionEditPage from './pages/SubscriptionEditPage'
import ProtectedRoute from './components/ProtectedRoute'
import SubscriptionViewPage from './pages/SubscriptionViewPage'

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
          <Route path='' element={<SiteLayout />}>
            <Route path='' element={<ProtectedRoute />}>
              <Route path='subscriptions' element={<SubscriptionsPage />} />
              <Route
                path='subscriptions/:subId'
                element={<SubscriptionViewPage />}
              />
              <Route
                path='subscriptions/:subId/edit'
                element={<SubscriptionEditPage />}
              />
              <Route path='/settings' element={<UserSettingsPage />}></Route>
            </Route>
          </Route>

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
