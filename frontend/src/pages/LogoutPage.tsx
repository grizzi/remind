import { useEffect } from 'react'
import { useAuth } from '../hooks/auth'
import { Navigate } from 'react-router'

export const LogoutPage = () => {
  const { logout } = useAuth()
  const { isLoggedIn } = useAuth()

  useEffect(() => logout(), [])

  if (isLoggedIn()) {
    return <Navigate to='/' />
  }
  return <></>
}

export default LogoutPage
