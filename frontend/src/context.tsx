import { Currency, Subscription, UserSettings } from './api/schema'
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { Api } from './api/api'

interface AppContextInterface {
  getCurrencies: () => Currency[]
  getUserSettings: () => UserSettings
  updateSubscriptions: () => Promise<void>
  getSubscriptions: () => Subscription[]
}

const defaultContext: AppContextInterface = {
  getCurrencies: () => [],
  getUserSettings: () => {
    throw new Error('User settings are not available yet')
  },
  updateSubscriptions: async () => {},
  getSubscriptions: () => [],
}

const AppContext = createContext<AppContextInterface>(defaultContext)
export const useAppContext = () => useContext(AppContext)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [userSettings, setUserSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    console.log('Mounting App Context provider')
    Api.getSupportedCurrencies()
      .then(data => setCurrencies(data))
      .catch(error => alert(error.message))
    Api.getUserSettings()
      .then(data => {
        console.log(JSON.stringify(data))
        setUserSettings(data)
      })
      .catch(error => alert(error.message))
  }, [])

  const getCurrencies = () => currencies

  const getUserSettings = () => userSettings

  const updateSubscriptions = async () => {
    try {
      const subs = await Api.getSubscriptions()
      console.log(JSON.stringify(subs))
      setSubscriptions(subs)
    } catch (err) {
      alert(err)
    }
  }

  const getSubscriptions = () => subscriptions

  return (
    <AppContext.Provider
      value={{
        getCurrencies,
        getUserSettings,
        updateSubscriptions,
        getSubscriptions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
