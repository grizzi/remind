import { toFormikValidate } from '../../shared/zod_utilities'
import { Formik, Form } from 'formik'
import { useEffect, useState } from 'react'

import {
  SubscriptionReadWrite,
  SubscriptionReadWriteSchema,
  Subscription,
  UserSettings,
  Currency,
  Label,
} from '../../api/schema'

import SelectField, { SelectOption } from '../inputs/SelectField'
import TextField from '../inputs/TextField'
import CheckboxField from '../inputs/CheckboxField'
import LabelEditor from './LabelsEditor'

const SubscriptionForm = ({
  subscription,
  settings,
  currencies,
  labels,
  onSubmit,
}: {
  settings: UserSettings
  currencies: Currency[]
  subscription: Subscription | undefined
  labels: Label[]
  onSubmit: (subscription: SubscriptionReadWrite) => Promise<void>
}) => {
  const [currenciesOptions, setCurrenciesOptions] = useState<SelectOption[]>([])
  const [newLabels, setNewLabels] = useState<Label[]>([])
  const [initialValues, setInitialValues] = useState<SubscriptionReadWrite>({
    title: '',
    amount: 0,
    amount_currency: '',
    billed_at: new Date(),
    remind: false,
    autorenewal: false,
    expiring_at: new Date(),
    external_link: '',
    labels: subscription?.labels || [],
  })

  useEffect(() => {
    console.log('Got subscriptions: ', JSON.stringify(subscription))
    if (subscription || settings) {
      setInitialValues(prevValues => ({
        ...prevValues,
        ...(subscription && {
          title: subscription.title,
          amount: subscription.amount,
          amount_currency: subscription.amount_currency,
          billed_at: subscription.billed_at,
          remind: subscription.remind,
          autorenewal: subscription.autorenewal,
          expiring_at: subscription.expiring_at,
          external_link: subscription.external_link,
          labels: subscription.labels,
        }),
        ...(settings && {
          amount_currency: settings.budget_currency,
        }),
      }))
    }

    if (currencies) {
      setCurrenciesOptions(
        currencies.map(el => ({
          value: el.code,
          label: el.name,
        })),
      )
    }
  }, [settings, subscription, currencies])

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async values => {
          values.labels = newLabels
          console.log(JSON.stringify(values.labels))
          await onSubmit(values)
        }}
        validate={toFormikValidate(SubscriptionReadWriteSchema)}
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
          <CheckboxField id='autorenewal' label='Autorenewal' />
          <TextField id='expiring_at' label='Expiring' />
          <TextField id='external_link' label='External Link' />
          <button type='submit'>Submit</button>
        </Form>
      </Formik>

      <LabelEditor
        subscription={subscription}
        allLabels={labels}
        setNewLabels={setNewLabels}
      />
    </div>
  )
}

export default SubscriptionForm
