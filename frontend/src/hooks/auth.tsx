import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import React from 'react'
import api from '../api/api'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { User } from '../api/schema'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '../constants'

type AuthContextType = {
  user: User | null
  registerUser: (username: string, password: string, email: string) => void
  loginUser: (username: string, password: string) => void
  logout: () => void
  isLoggedIn: () => boolean
  refreshUser: () => void
}

interface AuthResponse {
  refresh: string
  access: string
  user?: User
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const navigate = useNavigate()
  const [_, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem(USER)
    const access = localStorage.getItem(ACCESS_TOKEN)
    const refresh = localStorage.getItem(REFRESH_TOKEN)

    if (user && access) {
      setUser(JSON.parse(user))
      setAccessToken(access)
      setRefreshToken(refresh)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
    }
    setIsReady(true)
  }, [])

  const registerUser = async (
    username: string,
    password: string,
    email: string,
  ) => {
    await api
      .post('/api/register/', { username, password, email })
      .then(res => {
        if (res) {
          const userObj = {
            username: username,
            email: email,
          }

          localStorage.setItem(ACCESS_TOKEN, res?.data.access)
          localStorage.setItem(REFRESH_TOKEN, res?.data.refresh)
          localStorage.setItem(USER, JSON.stringify(userObj))
          setAccessToken(res?.data.access!)
          setRefreshToken(res?.data.refresh!)
          setUser(userObj!)
          toast.success('Registration successful!')
          navigate('/login')
        }
      })
      .catch((error: Error | AxiosError) => {
        let errorMessage = 'Failed to login!'
        if (axios.isAxiosError(error)) {
          if (error.status && error.status === 401) {
            errorMessage += ' Invalid username or password!'
          } else if (error.response) {
            errorMessage += ' ' + JSON.stringify(error.response.data)
          }
        }
        console.log(errorMessage)
        toast.error(errorMessage)
      })
  }

  const loginUser = async (username: string, password: string) => {
    api
      .post<AuthResponse>('/api/token/', {
        username,
        password,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        if (res) {
          localStorage.setItem(ACCESS_TOKEN, res?.data.access)
          const userObj = {
            username: username,
            email: res?.data?.user!.email,
          }
          localStorage.setItem(USER, JSON.stringify(userObj))
          setAccessToken(res?.data.access!)
          setRefreshToken(res?.data.refresh!)
          setUser(userObj!)
          toast.success('Login Success!')
          navigate('/subscriptions')
        }
      })
      .catch(_ => toast.warning('Server error occured'))
  }

  const isLoggedIn = () => {
    return !!user
  }

  const refreshUser = () => {
    api
      .post<AuthResponse>('/api/token/refresh/', {
        refresh: refreshToken,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res?.data.access)
          const userObj = {
            username: res!.data.user!.username,
            email: res!.data.user!.email,
          }
          localStorage.setItem(USER, JSON.stringify(userObj))
          setAccessToken(res?.data.access!)
          setRefreshToken(res?.data.refresh!)
          setUser(userObj!)
          toast.success('Login Success!')
          navigate('/search')
        } else {
          throw new Error('Failed to refresh the token')
        }
      })
      .catch((e: Error) => {
        toast.warning(e.message)
        navigate('/login')
      })
  }

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(USER)
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{ loginUser, user, logout, isLoggedIn, registerUser, refreshUser }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
