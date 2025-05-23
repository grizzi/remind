import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from './ProtectedRoute'

import SubscriptionsPage from '../pages/SubscriptionsPage'
import SubscriptionViewPage from '../pages/SubscriptionViewPage'
import SubscriptionEditPage from '../pages/SubscriptionEditPage'
import UserSettingsPage from '../pages/UserSettingsPage'
import UserSettingsEditPage from '../pages/UserSettingsEditPage'
import NotFound from '../pages/NotFound'
import LoginPage from '../pages/LoginPage'
import LogoutPage from '../pages/LogoutPage'
import RegisterPage from '../pages/RegisterPage'
import SiteLayout from '../components/SiteLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public routes
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'logout',
        element: <LogoutPage />,
      },
      // Protected routes with SiteLayout
      {
        element: (
          <ProtectedRoute>
            <SiteLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'subscriptions',
            element: <SubscriptionsPage />,
          },
          {
            path: 'subscriptions/:subId',
            element: <SubscriptionViewPage />,
          },
          {
            path: 'subscriptions/:subId/edit',
            element: <SubscriptionEditPage />,
          },
          {
            path: 'settings',
            element: <UserSettingsPage />,
          },
          {
            path: 'settings/edit',
            element: <UserSettingsEditPage />,
          },
          {
            path: '',
            element: <Navigate to='/subscriptions' replace />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
