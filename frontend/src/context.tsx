import { Currency, Subscription, UserSettings } from './api/schema'
import { createContext, useState, useContext, ReactNode } from 'react'
import { Api } from './api/api'

interface AppContextInterface {
  getCurrencies: () => Promise<Currency[]>
  getUserSettings: () => Promise<UserSettings>
  getSubscriptions: (forceUpdate: boolean) => Promise<Subscription[]>
}

const defaultContext: AppContextInterface = {
  getCurrencies: async () => [],
  getUserSettings: () => {
    throw new Error('User settings are not available yet')
  },
  getSubscriptions: async () => [],
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

  // Get currencies lazily and cache them
  const getCurrencies = async () => {
    if (currencies.length > 0) {
      console.log('Returning cached currencies')
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
      console.log('Returning cached subscriptions')
      return subscriptions
    }

    const subs = await Api.getSubscriptions()
    console.log(JSON.stringify(subs))
    setSubscriptions(subs)
    return subs
  }

  return (
    <AppContext.Provider
      value={{
        getCurrencies,
        getUserSettings,
        getSubscriptions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
