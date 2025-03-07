import { Currency, Subscription } from './api/schema'
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

  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    Api.getSupportedCurrencies()
      .then(data => setCurrencies(data))
      .catch(error => alert(error.message))
  }, [])

  const setCurrentSubscription = (sub: Subscription) => {
    setSubscription(sub)
  }

  const getCurrentSubscription = () => subscription
  const getCurrencies = () => currencies

  return (
    <AppContext.Provider
      value={{ setCurrentSubscription, getCurrentSubscription, getCurrencies }}
    >
      {children}
    </AppContext.Provider>
  )
}
