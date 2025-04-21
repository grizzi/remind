import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

import { UserSettings } from '../api/schema'
import UserSettingsView from '../components/views/UserSettingsView'
import { Navigate } from 'react-router'
import { Api } from '../api/api'
import { useAuth } from '../hooks/auth'

const UserSettingsPage = () => {
  const { getUserSettings } = useAppContext()
  const [editing, setEditing] = useState<boolean>(false)
  const [userDeleted, setUserDeleted] = useState<boolean>(false)
  const [settings, setSettings] = useState<UserSettings>()
  const { logout } = useAuth()

  useEffect(() => {
    getUserSettings()
      .then(settings => {
        setSettings(settings)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  if (!settings) {
    return <div></div>
  }

  if (editing) {
    return <Navigate to='/settings/edit' />
  }

  const deleteUser = () => {
    Api.deleteUser()
      .then(() => setUserDeleted(true))
      .catch(error => console.error(error?.response?.message))
  }

  if (userDeleted) {
    logout()
    return <Navigate to='/' />
  }

  return (
    <div>
      <UserSettingsView
        settings={settings}
        onDelete={() => deleteUser()}
        onEdit={() => setEditing(true)}
      />
    </div>
  )
}

export default UserSettingsPage
