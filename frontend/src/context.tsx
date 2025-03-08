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
  setCurrentSubscription: (sub: Subscription | undefined) => void
  getCurrentSubscription: () => Subscription | undefined
  getCurrencies: () => Currency[]
  getUserSettings: () => UserSettings
}

const AppContext = createContext<AppContextInterface | undefined>(undefined)
export const useAppContext = () => useContext(AppContext)

export default function AppContextProvider({
  children,
}: {
  children: ReactNode
}) {
  const [subscription, setSubscription] = useState<Subscription | undefined>(
    undefined,
  )
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
        setUserSettings(data[0])
      })
      .catch(error => alert(error.message))
  }, [])

  const setCurrentSubscription = (sub: Subscription | undefined) => {
    setSubscription(sub)
  }

  const getCurrentSubscription = () => subscription
  const getCurrencies = () => currencies
  const getUserSettings = () => userSettings!

  return (
    <AppContext.Provider
      value={{
        setCurrentSubscription,
        getCurrentSubscription,
        getCurrencies,
        getUserSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
