import { UserSettings } from '../../api/schema'

const UserSettingsView = ({ settings }: { settings: UserSettings }) => {
  console.log(JSON.stringify(settings))

  return (
    <div>
      <h1>User Settings</h1>
      <div>
        <p>
          Budget: {settings.budget} {settings.budget_currency}
        </p>
      </div>
      <div>
        <p>Default Currency: {settings.budget_currency}</p>
      </div>
      <div>
        <p>Remind at most {settings.remind_at_most} times</p>
      </div>
      <div>
        <p>Remind frequency: {settings.remind_frequency}</p>
      </div>
      <div>
        <p>
          Remind me {settings.remind_within_days} days before next renewal or
          cancellation.
        </p>
      </div>
      <div>
        <p>Reminders active: {settings.reminders_active ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}

export default UserSettingsView
