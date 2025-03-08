import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppContext } from '../context'

import UserSettingsView from '../components/views/UserSettingsView'
import UserSettingsForm from '../components/forms/UserSettingsForm'

const UserSettingsPage = () => {
  const navigate = useNavigate()
  const context = useAppContext()
  const settings = context?.getUserSettings() // Directly get it from context
  const [editSettings, setEditSettings] = useState<boolean>(false)

  useEffect(() => {
    console.log('resetting settings', JSON.stringify(settings))
  }, [settings])

  return (
    <div>
      <button onClick={() => navigate('/')}>Home</button>
      {!editSettings && (
        <button onClick={() => setEditSettings(true)}>Edit</button>
      )}
      {!editSettings && <UserSettingsView settings={settings!} />}
      {editSettings && <UserSettingsForm onSubmit={() => {}} />}
    </div>
  )
}

export default UserSettingsPage
