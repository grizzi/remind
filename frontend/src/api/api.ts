import { z } from 'zod'
import axios from 'axios'
import { ACCESS_TOKEN } from '../constants'

import { User } from './types'
import {
  SubscriptionSchema,
  UserSettingsSchema,
  CurrencySchema,
  Subscription,
  SubscriptionReadWriteSchema,
  UserSettings,
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

  error => {
    return Promise.reject(error)
  },
)

export namespace Api {
  const CurrenciesListSchema = z.array(CurrencySchema)
  const SubscriptionsListSchema = z.array(SubscriptionSchema)

  export const login = async (user: User) => {
    return await api.post('/api/token/', user)
  }

  interface Result {
    success: boolean
    data: any
    error: any
  }

  function throwOnError(result: Partial<Result>) {
    if (!result.success) {
      throw new Error(`API response validation failed: ${result.error}`)
    }
    return result.data
  }

  export const getSupportedCurrencies = async (): Promise<
    z.infer<typeof CurrenciesListSchema>
  > => {
    const response = await api.get('/api/currencies/')
    const result = CurrenciesListSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const getSubscriptions = async (): Promise<
    z.infer<typeof SubscriptionsListSchema>
  > => {
    const response = await api.get('/api/subscriptions/')
    console.log(JSON.stringify(response.data))
    const result = SubscriptionsListSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const getUserSettings = async (): Promise<
    z.infer<typeof UserSettingsSchema>
  > => {
    const response = await api.get('/api/settings/')
    const result = UserSettingsSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const createSubscription = async (
    sub: Partial<Subscription>,
  ): Promise<void> => {
    const result = SubscriptionReadWriteSchema.safeParse(sub)
    throwOnError(result)
    await api.post('/api/subscriptions/', sub)
  }

  export const updateSubscription = async (
    id: number,
    sub: Partial<Subscription>,
  ): Promise<void> => {
    const result = SubscriptionReadWriteSchema.safeParse(sub)
    throwOnError(result)
    await api.put(`/api/subscriptions/${id}/`, sub)
  }

  export const deleteSubscription = async (id: number) => {
    await api.delete(`/api/subscriptions/${id}/`)
  }

  export const updateUserSettings = async (
    settings: UserSettings,
  ): Promise<void> => {
    await api.put(`/api/settings/`, settings)
  }
}

export default api
