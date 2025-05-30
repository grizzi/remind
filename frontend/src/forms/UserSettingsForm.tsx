import { toFormikValidate } from '../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import {
  UserSettings,
  UserSettingsSchema,
  Currency,
  RemindFrequencySchema,
} from '../api/schema'
import SelectField, { SelectOption } from '../components/inputs/SelectField'
import NumericField from '../components/inputs/NumericField'
import CheckboxField from '../components/inputs/CheckboxField'
import SimpleButton from '../components/buttons/SimpleButton'

const UserSettingsForm = ({
  currentSettings,
  onSubmit,
  currencies,
}: {
  currentSettings: UserSettings
  currencies: Currency[] | undefined
  onSubmit: (settings: UserSettings) => Promise<void>
}) => {
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    if (!currencies) {
      return
    }
    setCurrenciesOptions(
      currencies.map(el => {
        return { value: el.code, label: `${el.code} (${el.name})` }
      }),
    )
  }, [currencies])

  return (
    <div>
      <p className='text-3xl mb-6'>User Settings</p>
      <Formik
        initialValues={currentSettings}
        enableReinitialize
        onSubmit={async values => await onSubmit(values)}
        validate={toFormikValidate(UserSettingsSchema)}
      >
        <Form>
          <NumericField id='remind_within_days' label='Remind within days' />
          <SelectField
            id='remind_frequency'
            label='Remind frequency'
            options={RemindFrequencySchema.options.map(opt => {
              return {
                label: opt,
                value: opt,
              }
            })}
          />
          <NumericField id='remind_at_most' label='Remind at most' />
          <div className='flex flex-row'>
            <div className='mr-2 w-full'>
              <NumericField id='budget' label='Budget' />
            </div>
            <div className='max-w-60'>
              <SelectField
                id='budget_currency'
                label='Currency'
                options={currenciesOptions}
              />
            </div>
          </div>
          <div className='mb-4'>
            <CheckboxField id='reminders_active' label='Reminders enabled' />
          </div>
          <div className='mb-4'>
            <CheckboxField
              id='monthly_report_active'
              label='Monthly report enabled'
            />
          </div>
          <div className='fixed border-0 bottom-8 right-6 flex flex-col items-end'>
            <SimpleButton text='Save' type='submit' />
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default UserSettingsForm
