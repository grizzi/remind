import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/auth'

type Props = { children: React.ReactNode }

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation()
  const { isLoggedIn, refreshUser } = useAuth()

  if (!isLoggedIn()) {
    console.log('Not logging in, trying to refresh token')
    refreshUser(location.pathname)
  } else {
    return <>{children}</>
  }

  return <></>
}

export default ProtectedRoute
