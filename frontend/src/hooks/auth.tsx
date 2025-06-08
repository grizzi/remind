import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import React from 'react'
import api from '../api/api'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'

import { User } from '../api/schema'
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '../constants'

type AuthContextType = {
  user: User | null
  registerUser: (username: string, password: string, email: string) => void
  loginUser: (username: string, password: string) => void
  logout: () => void
  isLoggedIn: () => boolean
  refreshUser: (from: string) => void
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
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Set the user credentials on refresh or first load
  useEffect(() => {
    const user = localStorage.getItem(USER)
    const access = localStorage.getItem(ACCESS_TOKEN)
    const refresh = localStorage.getItem(REFRESH_TOKEN)

    if (user && access) {
      setUser(JSON.parse(user))
      setAccessToken(access)
      setRefreshToken(refresh)
      setIsReady(true)
    }

    setIsReady(true)
  }, [])

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
      setLoggedIn(true)
    } else {
      delete api.defaults.headers.common['Authorization']
      setLoggedIn(false)
    }
  }, [accessToken])

  const registerUser = async (
    username: string,
    password: string,
    email: string,
  ) => {
    await api
      .post('/api/register/', { username, password, email })
      .then(res => {
        if (res.status === 201) {
          const userObj = {
            username: username,
            email: email,
          }

          toast.success(
            'Registration successful! We have sent you an activation link.',
          )
          setUser(userObj)
          navigate('/login')
        }
      })
      .catch((error: Error | AxiosError) => {
        let errorMessage = 'Failed to register!'
        if (axios.isAxiosError(error)) {
          if (error.status && error.status === 401) {
            errorMessage += ' Invalid username or password!'
          } else if (error.response) {
            errorMessage += ' ' + JSON.stringify(error.response.data)
          }
        }
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
          const userObj = {
            username: username,
            email: res?.data?.user!.email,
          }
          localStorage.setItem(ACCESS_TOKEN, res?.data.access)
          localStorage.setItem(REFRESH_TOKEN, res?.data.refresh)
          localStorage.setItem(USER, JSON.stringify(userObj))
          setAccessToken(res?.data.access!)
          setRefreshToken(res?.data.refresh!)
          setUser(userObj!)
          console.info(
            'Logged in with user',
            userObj,
            res?.data.access,
            res?.data.refresh,
          )
          navigate('/subscriptions', { replace: true })
        }
      })
      .catch(_ => toast.warning('Invalid username or password!'))
  }

  const isLoggedIn = () => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
      return false
    }

    const decoded = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000

    if (tokenExpiration && tokenExpiration < now) {
      return false
    }
    return loggedIn
  }

  const refreshUser = (from: string) => {
    api
      .post<AuthResponse>(
        '/api/token/refresh/',
        {
          refresh: refreshToken,
        },
        {
          timeout: 1000,
        },
      )
      .then((res: AxiosResponse<AuthResponse>) => {
        if (res.status === 200) {
          const userObj = {
            username: res!.data.user!.username,
            email: res!.data.user!.email,
          }
          localStorage.setItem(ACCESS_TOKEN, res?.data.access)
          localStorage.setItem(REFRESH_TOKEN, res?.data.refresh)
          localStorage.setItem(USER, JSON.stringify(userObj))

          setAccessToken(res?.data.access!)
          setRefreshToken(res?.data.refresh!)
          setUser(userObj!)
          navigate(from, { replace: true })
        } else {
          throw new Error('Failed to refresh the token')
        }
      })
      .catch((e: Error) => {
        console.error('Failed to refresh the token', e.message)
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
