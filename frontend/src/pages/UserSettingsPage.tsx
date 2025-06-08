import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

import { UserSettings } from '../api/schema'
import UserSettingsTable from '../components/shared/UserSettingsTable'
import { Navigate } from 'react-router'
import { Api } from '../api/api'
import { useAuth } from '../hooks/auth'
import { toast } from 'react-toastify'

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

  const sendMonthlyReport = () => {
    Api.sendMonthlyReport()
      .then(() => {
        toast.success('Monthly report sent successfully.')
      })
      .catch(error => {
        console.error('Failed to send monthly report:', error)
        toast.error('Failed to send monthly report. Please try again later.')
      })
  }

  if (userDeleted) {
    logout()
    return <Navigate to='/' />
  }

  return (
    <div>
      <UserSettingsTable
        settings={settings}
        onDelete={() => deleteUser()}
        onEdit={() => setEditing(true)}
        onSendReport={() => sendMonthlyReport()}
      />
    </div>
  )
}

export default UserSettingsPage
