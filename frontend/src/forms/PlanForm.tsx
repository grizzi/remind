import { Formik, Form } from 'formik'
import {
  Plan,
  PlanSchema,
  BillingFrequencySchema,
  UserSettings,
} from '../api/schema'
import { toFormikValidate } from '../shared/zod_utilities'
import TextField from '../components/inputs/TextField'
import SelectField from '../components/inputs/SelectField'
import CheckboxField from '../components/inputs/CheckboxField'
import DateField from '../components/inputs/DateField'
import NumericField from '../components/inputs/NumericField'
import SimpleButton from '../components/buttons/SimpleButton'
import { useEffect, useState } from 'react'
import { useAppContext } from '../context'

const PlanForm = ({
  plan,
  onSubmit,
}: {
  plan: Plan
  onSubmit: (plan: Plan) => void
}) => {
  const billingOptions = BillingFrequencySchema.options.map(option => ({
    value: option,
    label: option,
  }))

  const [settings, setSettings] = useState<UserSettings | null>(null)
  const { getUserSettings } = useAppContext()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getUserSettings()
        if (settings) {
          setSettings(settings)
        }
      } catch (error) {
        console.error('Failed to fetch user settings:', error)
      }
    }

    fetchSettings()
  }, [])

  if (!settings) {
    return <></>
  }

  return (
    <div>
      <Formik
        initialValues={plan}
        enableReinitialize
        validate={toFormikValidate(PlanSchema)}
        onSubmit={onSubmit}
      >
        <Form className='gap-2 items-start p-2 mt-1'>
          <TextField id='name' label='Name' />

          <div className='flex flex-col md:flex-row gap-2 w-full'>
            <DateField id='start_date' label='Start Date' />
            <DateField id='end_date' label='End Date' />
          </div>
          <div className='flex flex-col md:flex-row gap-2 w-full'>
            <NumericField
              id='cost'
              label={`Cost (${settings.budget_currency})`}
            />
            {/* <SelectField
            id='cost_currency'
            options={[
              {
                value: settings.budget_currency,
                label: settings.budget_currency,
              },
            ]}
            disabled
          /> */}
            <SelectField
              id='billing_frequency'
              options={billingOptions}
              label='Billing frequency'
            />
          </div>
          <div className='w-full'>
            <CheckboxField id='auto_renew' label='Auto renew' />
          </div>
          <div className='fixed bottom-8 right-6'>
            <SimpleButton text='Save' type='submit' />
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default PlanForm
