import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/auth'

type Props = { children: React.ReactNode }

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation()
  const { isLoggedIn, refreshUser } = useAuth()

  if (!isLoggedIn){
    refreshUser();
  }
  return isLoggedIn() ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default ProtectedRoute
