import { toFormikValidate } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import { useAppContext } from '../../context'
import { UserSettings, UserSettingsSchema } from '../../api/schema'
import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'

const UserSettingsForm = ({
  onSubmit,
}: {
  onSubmit: (settings: UserSettings) => Promise<void>
}) => {
  const settings = useAppContext().getUserSettings()
  const currencies = useAppContext().getCurrencies()
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])

  const [initialValues, setInitialValues] = useState<UserSettings>({
    remind_within_days: 0,
    remind_frequency: '',
    remind_at_most: 0,
    reminders_active: false,
    budget: 0,
    budget_currency: '',
  })

  useEffect(() => {
    setInitialValues(settings)
  }, [settings])

  useEffect(() => {
    if (!currencies) {
      return
    }
    setCurrenciesOptions(
      currencies.map(el => {
        return { value: el.code, label: el.name }
      }),
    )
  }, [])

  return (
    <div>
      <Formik
        initialValues={initialValues}
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
