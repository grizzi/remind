import { toFormikValidate } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import { UserSettings, UserSettingsSchema, Currency } from '../../api/schema'
import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'

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
        return { value: el.code, label: el.name }
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
          <TextField id='remind_within_days' label='Remind within days' />
          <TextField id='remind_frequency' label='Remind frequency' />
          <TextField id='remind_at_most' label='Remind at most' />
          <TextField id='budget' label='Budget' />
          <SelectField
            id='budget_currency'
            label='Default currency'
            options={currenciesOptions}
          />

          <button type='submit'>Submit</button>
        </Form>
      </Formik>
    </div>
  )
}

export default UserSettingsForm
