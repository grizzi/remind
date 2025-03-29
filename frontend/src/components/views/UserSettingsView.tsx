import { UserSettings } from '../../api/schema'

import React from 'react'

interface UserSettingsViewProps {
  settings: UserSettings
  onEdit: () => void
  onDelete: () => void
}

const UserSettingsView: React.FC<UserSettingsViewProps> = ({
  settings,
  onEdit,
  onDelete,
}) => {
  const {
    remind_within_days,
    remind_frequency,
    remind_at_most,
    reminders_active,
    budget,
    budget_currency,
  } = settings

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold'>User Settings</h2>
        <div className='space-x-2'>
          <button
            onClick={onEdit}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700'
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700'
          >
            Delete Account
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <SettingItem label='Remind Within Days' value={remind_within_days} />
        <SettingItem label='Remind Frequency' value={remind_frequency} />
        <SettingItem label='Remind At Most' value={remind_at_most} />
        <SettingItem
          label='Reminders Active'
          value={reminders_active ? 'Yes' : 'No'}
        />
        <SettingItem
          label='Budget'
          value={`${budget.toFixed(2)} ${budget_currency}`}
        />
      </div>
    </div>
  )
}

const SettingItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className='flex flex-col'>
    <span className='text-sm text-gray-500'>{label}</span>
    <span className='text-base font-medium text-gray-900'>{value}</span>
  </div>
)

export default UserSettingsView
