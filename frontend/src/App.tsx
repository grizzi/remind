import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from './pages/Login'
import SubscriptionsPage from './pages/SubscriptionsPage'
import NotFound from './pages/NotFound'
import UserSettingsPage from './pages/UserSettingsPage'
import SiteLayout from './components/SiteLayout'
import SubscriptionEditPage from './pages/SubscriptionEditPage'
import ProtectedRoute from './components/ProtectedRoute'
import SubscriptionViewPage from './pages/SubscriptionViewPage'
import UserSettingsEditPage from './pages/UserSettingsEditPage'

function Logout() {
  localStorage.clear()
  return <Navigate to='/login' />
}

function LogoutAndRegister() {
  localStorage.clear()
  return <Login />
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
              <Route path='/settings' element={<UserSettingsPage />} />
              <Route path='/settings/edit' element={<UserSettingsEditPage />} />
            </Route>
          </Route>

          <Route path='/login' element={<Login />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/register' element={<LogoutAndRegister />}></Route>
          <Route
            path='/'
            element={<Navigate replace to='/subscriptions' />}
          />
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
