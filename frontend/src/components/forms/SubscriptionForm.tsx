import { toFormikValidationSchema } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import { useAppContext } from '../../context'
import { SubscriptionSchema } from '../../api/schema'
import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'

type SubscriptionFormValuesInterface = {
  title: string
  amount: number
  amount_currency: string
  billed_at: string
  remind: boolean
  autorenewal: boolean
  expiring_at: string
  external_link: string
}

const SubscriptionForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const context = useAppContext()
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])

  const [initialValues, setInitialValues] =
    useState<SubscriptionFormValuesInterface>({
      title: '',
      amount: 0,
      amount_currency: '',
      billed_at: '',
      remind: false,
      autorenewal: false,
      expiring_at: '',
      external_link: '',
    })

  useEffect(() => {
    const sub = context!.getCurrentSubscription()
    console.log('In effect')
    if (sub !== undefined) {
      console.log('Setting the initial values')
      setInitialValues({
        ...initialValues,
        title: sub.title,
        amount: sub.amount,
        amount_currency: sub.amount_currency,
        billed_at: sub.billed_at.toDateString(),
        remind: sub.remind,
        autorenewal: sub.autorenewal,
        expiring_at: sub.expiring_at.toDateString(),
        external_link: sub.external_link,
      })
    }

    setCurrenciesOptions(
      context!.getCurrencies().map(el => {
        return { value: el.code, label: el.name }
      }),
    )
  }, [])

  
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
          <TextField id='title' label='Title' />
          <TextField id='amount' label='Amount' />
          <SelectField
            id='amount_currency'
            label='Currency'
            options={currenciesOptions}
          />
          <TextField id='billed_at' label='Billed' />
          <TextField id='autorenewal' label='Autorenewal' />
          <TextField id='expiring_at' label='Expiring' />
          <TextField id='external_link' label='External Link' />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>
    </div>
  )
}

export default SubscriptionForm
