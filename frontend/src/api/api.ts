import { z } from 'zod'
import axios from 'axios'

import {
  SubscriptionsListSchema,
  UserSettingsSchema,
  CurrenciesListSchema,
  Subscription,
  SubscriptionReadWriteSchema,
  UserSettings,
  LabelsListSchema,
  Label,
  PlansListSchema,
  Plan,
  PlanSchema,
  SubscriptionSchema,
} from './schema'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export namespace Api {
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
  ): Promise<Subscription> => {
    const result = SubscriptionReadWriteSchema.safeParse(sub)
    const validated = throwOnError(result)
    const response = await api.post('/api/subscriptions/', validated)
    const subscription = SubscriptionSchema.safeParse(response.data)

    const subscription_validated = throwOnError(subscription)
    return subscription_validated
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

  export const deleteUser = async () => {
    await api.delete(`/api/delete/`)
  }

  export const sendMonthlyReport = async (): Promise<void> => {
    await api.post(`/api/send-monthly-report/`)
  }

  export const doSync = async (): Promise<void> => {
    await api.post(`/api/sync/`)
  }

  export const getLabels = async (): Promise<
    z.infer<typeof LabelsListSchema>
  > => {
    const response = await api.get('/api/labels/')
    const result = LabelsListSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const updateLabels = async (labels: Label[]): Promise<void> => {
    await api.put(`/api/labels/`, labels)
  }

  export const getPlans = async (
    subscription: string,
    plan?: string,
  ): Promise<z.infer<typeof PlansListSchema>> => {
    let url = `/api/subscriptions/${subscription}/plans/`

    if (plan) {
      url += `${plan}/`
    }

    const response = await api.get(url)
    const result = PlansListSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const getPlan = async (
    subscription: string,
    plan: string,
  ): Promise<z.infer<typeof PlanSchema>> => {
    let url = `/api/subscriptions/${subscription}/plans/${plan}/`
    const response = await api.get(url)
    const result = PlanSchema.safeParse(response.data)
    return throwOnError(result)
  }

  export const updatePlan = async (
    subscription: number,
    plan: Plan,
  ): Promise<void> => {
    const result = PlanSchema.safeParse(plan)
    const validated = throwOnError(result)

    if (validated.id) {
      await api.put(
        `/api/subscriptions/${subscription}/plans/${validated.id}/`,
        validated,
      )
    } else {
      await api.post(`/api/subscriptions/${subscription}/plans/`, validated)
    }
  }

  export const deletePlan = async (
    subscription: number,
    plan: Plan,
  ): Promise<void> => {
    await api.delete(`/api/subscriptions/${subscription}/plans/${plan.id}/`)
  }

  export const activateAccount = async (
    uid: string,
    token: string,
  ): Promise<void> => {
    const response = await api.post(`/api/activate/${uid}/${token}`)

    if (response.status !== 200) {
      throw new Error(`Activation failed with status: ${response.status}`)
    }
    return response.data
  }

  export const resetPassword = async (
    uidb64: string,
    token: string,
    newPassword: string,
  ): Promise<void> => {
    const response = await api.post(`/api/password-reset/${uidb64}/${token}/`, {
      new_password: newPassword,
    })

    if (response.status !== 200) {
      throw new Error(`Password reset failed with status: ${response.status}`)
    }
  }

  export const resetPasswordRequest = async (
    username: string,
  ): Promise<void> => {
    const response = await api.post(`/api/password-reset/`, { username })

    if (response.status !== 200) {
      throw new Error(
        `Password reset request failed with status: ${response.status}`,
      )
    }
  }
}

export default api
