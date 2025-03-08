import { toFormikValidationSchema } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import { useAppContext } from '../../context'
import { SubscriptionSchema } from '../../api/schema'
import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'

type UserSettingsFormInitialValuesInterface = {
  remind_within_days: number
  remind_frequency: string
  remind_at_most: number
  reminders_active: boolean
  budget: number
  budget_currency: string
}

const UserSettingsForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const context = useAppContext()
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])

  const [initialValues, setInitialValues] =
    useState<UserSettingsFormInitialValuesInterface | null>(null)

  useEffect(() => {
    const settings = context!.getUserSettings()
    console.log('In effect')
    setInitialValues({
      remind_within_days: settings.remind_within_days,
      remind_frequency: settings.remind_frequency,
      remind_at_most: settings.remind_at_most,
      reminders_active: settings.reminders_active,
      budget: settings.budget,
      budget_currency: settings.budget_currency,
    })

    setCurrenciesOptions(
      context!.getCurrencies().map(el => {
        return { value: el.code, label: el.name }
      }),
    )
  }, [])

  if (!initialValues) {
    return <div>Loading...</div> // Prevents rendering Formik until initialValues is set
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          // onSubmit(values)
          actions.setSubmitting(false)
        }}
        validationSchema={toFormikValidationSchema(SubscriptionSchema)}
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
