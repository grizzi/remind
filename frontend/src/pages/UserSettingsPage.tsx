import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

import { UserSettings } from '../api/schema'
import UserSettingsView from '../components/views/UserSettingsView'
import { Navigate } from 'react-router'
import { Api } from '../api/api'
const UserSettingsPage = () => {
  const { getUserSettings } = useAppContext()
  const [editing, setEditing] = useState<boolean>(false)
  const [userDeleted, setUserDeleted] = useState<boolean>(false)
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

  const deleteUser = () => {
    Api.deleteUser()
      .then(() => setUserDeleted(true))
      .catch(error => alert(error?.response?.message))
  }

  if (userDeleted) {
    return <Navigate to='/register' />
  }
  return (
    <div>
      <button onClick={() => deleteUser()}>Delete Account</button>
      <button onClick={() => setEditing(true)}>Edit</button>
      <UserSettingsView settings={settings} />
    </div>
  )
}

export default UserSettingsPage
