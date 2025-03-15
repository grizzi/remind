import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

import { Api } from '../api/api'
import { UserSettings } from '../api/schema'
import UserSettingsView from '../components/views/UserSettingsView'
import UserSettingsForm from '../components/forms/UserSettingsForm'

const UserSettingsPage = () => {
  const context = useAppContext()
  const settings = context.getUserSettings()
  const [editSettings, setEditSettings] = useState<boolean>(false)

  useEffect(() => {
    console.log('resetting settings', JSON.stringify(settings))
  }, [settings])

  if (!settings) {
    return <div>No settings!</div>
  }

  const onSubmit = async (settings: UserSettings): Promise<void> => {
    console.log('Submitting settings', JSON.stringify(settings))
    Api.updateUserSettings(settings)
      .then(() => {
        setEditSettings(false)
      })
      .catch(error => {
        alert(
          `Failed to update subscription!: ${error.message} ${JSON.stringify(
            error,
          )}`,
        )
      })
  }

  return (
    <div>
      {!editSettings && (
        <button onClick={() => setEditSettings(true)}>Edit</button>
      )}
      {!editSettings && <UserSettingsView settings={settings!} />}
      {editSettings && <UserSettingsForm onSubmit={onSubmit} />}
    </div>
  )
}

export default UserSettingsPage
