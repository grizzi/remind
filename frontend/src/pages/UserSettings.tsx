import { useEffect, useState } from 'react'
import { Api } from '../api/api'
import { UserSettings } from '../api/schema'
import { useNavigate } from 'react-router'

const UserSettingsPage = () => {
  const [settings, setSettings] = useState<UserSettings[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    Api.getUserSettings()
      .then(data => setSettings(data))
      .catch(error => alert(error.message))
  }, [])
  
  return (
    <div>
      <button onClick={() => navigate("/")}>Home</button>
      <h1>User Settings</h1>
      <p>{JSON.stringify(settings)}</p>
    </div>
  )
}

export default UserSettingsPage
