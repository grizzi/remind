import { useEffect, useState } from 'react'
import { useAppContext } from '../context'
import { Navigate } from 'react-router-dom'

import { Api } from '../api/api'
import { Currency, UserSettings } from '../api/schema'
import UserSettingsForm from '../forms/UserSettingsForm'

const UserSettingsEditPage = () => {
  const context = useAppContext()

  // State is managed in the context
  const [submit, setSubmit] = useState(false)
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    context
      .getCurrencies()
      .then(curr => {
        setCurrencies(curr)
      })
      .catch(err => {
        console.error(err)
      })

    context
      .getUserSettings()
      .then(settings => {
        setSettings(settings)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const onSubmit = async (settings: UserSettings): Promise<void> => {
    Api.updateUserSettings(settings)
      .then(() => setSubmit(true))
      .catch(error => {
        console.error(
          `Failed to update user settings!: ${error.message} ${JSON.stringify(
            error,
          )}`,
        )
      })
  }

  if (!settings) {
    return <div></div>
  }

  if (submit) {
    return <Navigate to='/settings' />
  }

  return (
    <div>
      <UserSettingsForm
        currentSettings={settings}
        onSubmit={onSubmit}
        currencies={currencies}
      />
    </div>
  )
}

export default UserSettingsEditPage
