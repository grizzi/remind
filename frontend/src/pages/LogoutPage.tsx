import { useEffect } from 'react'
import { useAuth } from '../hooks/auth'

export const LogoutPage = () => {
  const { logout } = useAuth()

  useEffect(() => logout(), [])

  return <></>
}

export default LogoutPage
