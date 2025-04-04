import axios from 'axios'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react'

import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants'

interface AuthContextInterface {
  token: string | null
  setToken: (token: string | null) => void
}

const defaultContext: AuthContextInterface = {
  token: null,
  setToken: () => {
    throw new Error('setToken is not implemented')
  },
}

const AuthContext = createContext<AuthContextInterface>(defaultContext)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken_] = useState(localStorage.getItem('token'))

  const setToken = (newToken: string) => {
    setToken_(newToken)
  }

  export const refreshToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post('/api/token/', {
        refresh_token: localStorage.getItem(REFRESH_TOKEN),
      })
      const newToken = response.data.access_token
      localStorage.setItem(ACCESS_TOKEN, newToken)
      return newToken
    } catch (error) {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      console.error('Failed to refresh token:', error)
      return null
    }
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem(ACCESS_TOKEN, token)
    } else {
      refreshToken()
    }
  }, [token])

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
