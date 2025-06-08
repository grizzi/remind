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
import ConfirmDeleteModal from './ConfirmModal'

interface UserSettingsViewProps {
  settings: UserSettings
  onEdit: () => void
  onDelete: () => void
  onSendReport?: () => void
}

const UserSettingsTable: React.FC<UserSettingsViewProps> = ({
  settings,
  onEdit,
  onDelete,
  onSendReport = () => {
    console.warn('onSendReport function not implemented')
  },
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

  const SettingIcon = ({ Icon }: { Icon: React.ElementType }) => (
    <div className='w-12 h-12 dark:text-white dark:bg-gradient-to-br dark:from-blue-400 dark:to-purple-500 flex justify-center items-center rounded-full'>
      <Icon className='text-purple-700 dark:text-white size-8' />
    </div>
  )

  return (
    <div>
      <div className='mb-6 flex flex-row justify-between items-center'>
        <p className='text-3xl font-bold'>User Settings</p>
        <button onClick={() => onEdit()}>
          <TbEdit className='px-2 size-10 text-purple-700 dark:text-white hover:text-purple-200 transition-all' />
        </button>
      </div>

      <div className='grid grid-cols-[3.5rem_auto] gap-4'>
        <SettingIcon Icon={TbCalendarBolt} />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me
            <span className='font-extrabold'> {remind_within_days}</span> days
            before expiry/renewal
          </p>
        </div>

        <SettingIcon Icon={TbCalendarRepeat} />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me every
            <span className='font-extrabold'>
              {' '}
              {remind_frequency.split('ly')[0]}
            </span>
          </p>
        </div>

        <SettingIcon Icon={TbTimeDuration5} />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Remind me at most
            <span className='font-extrabold'> {remind_at_most}</span> time
            {remind_at_most > 1 ? 's' : ''}
          </p>
        </div>

        <SettingIcon Icon={TbMoneybag} />
        <div className='flex flex-row items-center gap-2'>
          <p className='font-extrabold'>
            {budget.toFixed(2)} {budget_currency}
          </p>
        </div>

        <SettingIcon Icon={TbBell} />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Reminders:{' '}
            <span className='font-extrabold'>
              {reminders_active ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>

        <SettingIcon Icon={TbReport} />
        <div className='flex flex-row items-center gap-2'>
          <p>
            Monthly Report:{' '}
            <span className='font-extrabold'>
              {monthly_report_active ? 'Enabled' : 'Disabled'}
            </span>
          </p>
        </div>
      </div>

      <div className='fixed border-0 bottom-8 left-6 flex flex-col items-end'>
        <button
          className='p-2 items-center justify-center bg-purple-600 dark:bg-gradient-to-br dark:from-blue-400 dark:to-purple-500  text-white rounded-sm shadow-lg md:bg-purple-300 hover:bg-purple-600 transition-all'
          aria-label={`Button: Send Monthly Report`}
          onClick={() => onSendReport()}
          type='button'
        >
          Send Monthly Report
        </button>
      </div>

      <div className='fixed border-0 bottom-8 right-6 flex flex-col items-end'>
        <ConfirmDeleteModal
          dialog_title='Confirm Account Deletion'
          prompt='Are you sure you want to delete your account? This action cannot be undone.'
          action='Delete Account'
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}

export default UserSettingsTable
