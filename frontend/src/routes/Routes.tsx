import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import ProtectedRoute from './ProtectedRoute'

import SubscriptionsPage from '../pages/OverviewPage'
import SubscriptionViewPage from '../pages/SubscriptionPage'
import SubscriptionEditPage from '../pages/SubscriptionEditPage'
import UserSettingsPage from '../pages/UserSettingsPage'
import UserSettingsEditPage from '../pages/UserSettingsEditPage'
import NotFound from '../pages/NotFound'
import LoginPage from '../pages/LoginPage'
import LogoutPage from '../pages/LogoutPage'
import RegisterPage from '../pages/RegisterPage'
import ActivationPage from '../pages/ActivationPage'
import PlanEditPage from '../pages/PlanEditPage'
import SiteLayout from '../components/SiteLayout'
import PasswordResetPage from '../pages/PasswordResetPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className='bg-white dark:text-white dark:bg-gray-800 min-h-screen'>
        <App />
      </div>
    ),
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
        path: 'activate/:uidb64/:token',
        element: <ActivationPage />,
      },
      {
        path: 'password-reset/:uidb64/:token',
        element: <PasswordResetPage />,
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
            path: 'subscriptions/:subId/plans/:planId/edit',
            element: <PlanEditPage />,
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
