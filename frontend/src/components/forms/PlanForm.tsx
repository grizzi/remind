import { Formik, Form } from 'formik'
import TextField from '../inputs/TextField'
import { Currency, Plan, PlanSchema, UserSettings } from '../../api/schema'
import { useState, useEffect } from 'react'
import { toFormikValidate } from '../../shared/zod_utilities'
import SelectField, { SelectOption } from '../inputs/SelectField'
import CheckboxField from '../inputs/CheckboxField'
import DateField from '../inputs/DateField'

const PlanForm = ({
  currentPlan,
  settings,
  currencies,
  onSave,
  onDiscard,
}: {
  currentPlan?: Plan
  settings: UserSettings
  currencies: Currency[]
  onSave: () => void
  onDiscard: () => void
}) => {
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])
  const [disabled, setDisabled] = useState<boolean>(true)

  const [initialValues, setInitialValues] = useState<Plan>({
    subscription: currentPlan?.subscription,
    auto_renew: currentPlan?.auto_renew || true,
    start_date: currentPlan?.start_date || new Date(),
    end_date: currentPlan?.end_date,
    cost: currentPlan?.cost || 0,
    cost_currency: currentPlan?.cost_currency || settings.budget_currency,
    billing_frequency: currentPlan?.billing_frequency,
  })

  useEffect(() => {
    if (currentPlan || settings) {
      setInitialValues(prevValues => ({
        ...prevValues,
        ...(currentPlan && {
          subscription: currentPlan.subscription,
          auto_renew: currentPlan.auto_renew,
          start_date: currentPlan.start_date,
          end_date: currentPlan.end_date,
          cost: currentPlan.cost,
          cost_currency: currentPlan.cost_currency,
          billing_frequency: currentPlan.billing_frequency,
        }),
        ...(settings && {
          cost_currency: settings.budget_currency,
        }),
      }))
    }

    if (currencies) {
      setCurrenciesOptions(
        currencies.map(el => ({
          value: el.code,
          label: el.code,
        })),
      )
    }
  }, [settings, currentPlan, currencies])

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async values => {
          console.log(JSON.stringify(values))
          onSave()
        }}
        validate={toFormikValidate(PlanSchema)}
      >
        <Form className='flex flex-row items-center max-w-3xl'>
          <CheckboxField
            id='auto_renew'
            label='Autorenew'
            disabled={disabled}
          />
          <DateField id='start_date' label='Start date' disabled={disabled} />
          <DateField id='end_date' label='End date' disabled={disabled} />
          <TextField id='cost' label='Cost' disabled={disabled} />
          <SelectField
            id='cost_currency'
            label='Currency'
            disabled={disabled}
            options={currenciesOptions}
          />
          <SelectField
            id='billing_freqeuncy'
            label='Billing Frequency'
            disabled={disabled}
            options={['Daily', 'Monthly', 'Weekly', 'Yearly'].map(entry => {
              return { value: entry, label: entry }
            })}
          />

          <div className='flex flex-row justify-around'>
            <button
              className='flex items-center justify-center w-42 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
              aria-label='Discard current plan modifications'
              type='button'
              onClick={() => setDisabled(!disabled)}
            >
              Edit
            </button>
            <button
              className='flex items-center justify-center w-42 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
              aria-label='Save current plan'
              type='submit'
            >
              Save
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}

export default PlanForm
