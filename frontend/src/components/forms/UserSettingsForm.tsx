import { toFormikValidate } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import { UserSettings, UserSettingsSchema, Currency } from '../../api/schema'
import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'
import NumericField from '../inputs/NumericField'

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
      <Formik
        initialValues={currentSettings}
        enableReinitialize
        onSubmit={async values => await onSubmit(values)}
        validate={toFormikValidate(UserSettingsSchema)}
      >
        <Form>
          <NumericField id='remind_within_days' label='Remind within days' />
          <TextField id='remind_frequency' label='Remind frequency' />
          <NumericField id='remind_at_most' label='Remind at most' />
          <NumericField id='budget' label='Budget' />
          <SelectField
            id='budget_currency'
            label='Default currency'
            options={currenciesOptions}
          />

          <button
            className='flex items-center justify-center w-24 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
            aria-label='Add new entry'
            type='submit'
          >
            Save
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default UserSettingsForm
