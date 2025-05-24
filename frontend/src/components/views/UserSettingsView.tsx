import { UserSettings } from '../../api/schema'
import {
  TbCalendarBolt,
  TbMoneybag,
  TbCalendarRepeat,
  TbBell,
  TbTimeDuration5,
  TbReport,
  TbEdit,
} from 'react-icons/tb'

import React from 'react'
import ConfirmDeleteModal from '../shared/ConfirmModalNew'

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
    monthly_report_active,
    budget,
    budget_currency,
  } = settings

  return (
    <div className='bg-white'>
      <div className='mb-6 flex flex-row justify-between items-center mb-6'>
        <p className='text-3xl'>User Settings</p>
        <button onClick={() => onEdit()}>
          <TbEdit className='px-2 size-10 text-purple-700 hover:text-purple-200 transition-all' />
        </button>
      </div>

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
              {reminders_active ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>

        <TbReport className='text-purple-700 flex flex-auto justify-center items-center size-8' />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Monthly Report:{' '}
            <span className='font-extrabold'>
              {monthly_report_active ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>
      </div>
      <ConfirmDeleteModal onDelete={onDelete} />
    </div>
  )
}

export default UserSettingsView
