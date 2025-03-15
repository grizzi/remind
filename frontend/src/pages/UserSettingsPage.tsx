import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

import { UserSettings } from '../api/schema'
import UserSettingsView from '../components/views/UserSettingsView'
import { Navigate } from 'react-router'

const UserSettingsPage = () => {
  const { getUserSettings } = useAppContext()
  const [editing, setEditing] = useState<boolean>(false)
  const [settings, setSettings] = useState<UserSettings>()

  useEffect(() => {
    getUserSettings()
      .then(settings => {
        setSettings(settings)
      })
      .catch(err => {
        alert(err)
      })
  }, [])

  if (!settings) {
    return <div></div>
  }

  if (editing) {
    return <Navigate to='/settings/edit' />
  }

  return (
    <div>
      <button onClick={() => setEditing(true)}>Edit</button>
      <UserSettingsView settings={settings} />
    </div>
  )
}

export default UserSettingsPage
