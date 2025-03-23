import { Currency, Label, Subscription, UserSettings } from './api/schema'
import { createContext, useState, useContext, ReactNode } from 'react'
import { Api } from './api/api'

interface AppContextInterface {
  getCurrencies: () => Promise<Currency[]>
  getUserSettings: () => Promise<UserSettings>
  getSubscriptions: (forceUpdate: boolean) => Promise<Subscription[]>
  getLabels: () => Promise<Label[]>
}

const defaultContext: AppContextInterface = {
  getCurrencies: async () => [],
  getUserSettings: () => {
    throw new Error('User settings are not available yet')
  },
  getSubscriptions: async () => [],
  getLabels: async () => [],
}

const AppContext = createContext<AppContextInterface>(defaultContext)
export const useAppContext = () => useContext(AppContext)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [, setUserSettings] = useState<UserSettings | undefined>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [labels, setLabels] = useState<Label[]>([])

  // Get currencies lazily and cache them
  const getCurrencies = async () => {
    if (currencies.length > 0) {
      return currencies
    }

    try {
      const curr = await Api.getSupportedCurrencies()
      setCurrencies(curr)
      return curr // Ensure this resolves to the new currencies
    } catch (err) {
      alert(err)
      return []
    }
  }

  // Always fetch the freshest user settings
  const getUserSettings = async () => {
    const settings = await Api.getUserSettings()
    setUserSettings(settings)
    return settings
  }

  const getSubscriptions = async (forceUpdate = false) => {
    if (!forceUpdate && subscriptions.length > 0) {
      return subscriptions
    }

    const subs = await Api.getSubscriptions()
    setSubscriptions(subs)
    return subs
  }

  const getLabels = async () => {
    const labs = await Api.getLabels()
    setLabels(labs)
    return labs
  }

  return (
    <AppContext.Provider
      value={{
        getCurrencies,
        getUserSettings,
        getSubscriptions,
        getLabels,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
