import { z } from 'zod'
import axios from 'axios'
import { ACCESS_TOKEN } from '../constants'

import { User } from './types'
import {
  SubscriptionSchema,
  UserSettingsSchema,
  CurrencySchema,
} from './schema'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    }
    return config
  },
  // TODO: I have to read about async JS
  error => {
    return Promise.reject(error)
  },
)

export namespace Api {
  export const login = async (user: User) => {
    return await api.post('/api/token/', user)
  }

  function createGetEndpoint<T extends z.ZodType>(path: string, schema: T) {
    return async (): Promise<z.infer<T>> => {
      const response = await api.get(path)
      const result = schema.safeParse(response.data)

      if (!result.success) {
        throw new Error(`API response validation failed: ${result.error}`)
      }

      return result.data
    }
  }

  export const getSupportedCurrencies = createGetEndpoint(
    '/api/currencies',
    z.array(CurrencySchema),
  )

  export const getSubscriptions = createGetEndpoint(
    '/api/subscriptions/',
    z.array(SubscriptionSchema),
  )

  export const getUserSettings = createGetEndpoint(
    '/api/settings/',
    z.array(UserSettingsSchema),
  )
}

export default api
