import { UserSettings } from '../../api/schema'
import {
  TbCalendarBolt,
  TbMoneybag,
  TbCalendarRepeat,
  TbBell,
  TbTimeDuration5,
} from 'react-icons/tb'

import React from 'react'
import CheckboxField from '../inputs/CheckboxField'

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
    <div className='max-w-2xl bg-white'>
      <p className='text-3xl mb-6'>User Settings</p>

      <div className='grid grid-cols-[1.5rem_auto] gap-4'>
        <TbCalendarBolt className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me
            <span className='font-extrabold'> {remind_within_days}</span> days
            before expiry/renewal
          </p>
        </div>

        <TbCalendarRepeat className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me every
            <span className='font-extrabold'>
              {' '}
              {remind_frequency.split('ly')[0]}
            </span>
          </p>
        </div>

        <TbTimeDuration5 className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me at most
            <span className='font-extrabold'> {remind_at_most}</span> time
            {remind_at_most > 1 ? 's' : ''}
          </p>
        </div>

        <TbMoneybag className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p className='font-extrabold'>
            {budget.toFixed(2)} {budget_currency}
          </p>
        </div>

        <TbBell className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Reminders:{' '}
            <span className='font-extrabold'>
              {reminders_active ? 'Active' : 'Disabled'}
            </span>
          </p>
        </div>
      </div>
      <div className='fixed border-0 bottom-8 right-8 flex flex-row justify-end mt-6 mb-6'>
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
    </div>
  )
}

export default UserSettingsView
