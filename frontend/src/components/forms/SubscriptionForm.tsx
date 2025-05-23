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

import TextField from '../inputs/TextField'
import LabelEditor from './LabelsEditor'

const SubscriptionForm = ({
  subscription,
  settings,
  labels,
  onSubmit,
}: {
  settings: UserSettings
  currencies: Currency[]
  subscription: Subscription | undefined
  labels: Label[]
  onSubmit: (subscription: SubscriptionReadWrite) => Promise<void>
}) => {
  const [newLabels, setNewLabels] = useState<Label[]>([])

  const [initialValues, setInitialValues] = useState<SubscriptionReadWrite>({
    title: '',
    remind: false,
    external_link: '',
    labels: subscription?.labels || [],
  })

  useEffect(() => {
    if (subscription || settings) {
      setInitialValues(prevValues => ({
        ...prevValues,
        ...(subscription && {
          title: subscription.title,
          remind: subscription.remind,
          external_link: subscription.external_link,
          labels: subscription.labels,
        }),
      }))
    }
  }, [settings, subscription])

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async values => {
          values.labels = newLabels
          values.labels.forEach(l => {
            if (subscription) {
              l.subscription = subscription.id
            }
          })
          console.log(
            'Submitting the following labels: ',
            JSON.stringify(values.labels),
          )
          await onSubmit(values)
        }}
        validate={toFormikValidate(SubscriptionReadWriteSchema)}
      >
        <Form className='w-full'>
          <TextField id='title' label='Title' />
          <TextField id='external_link' label='External Link' />
          <LabelEditor
            subscription={subscription}
            allLabels={labels}
            setNewLabels={setNewLabels}
          />

          <div className='flex flex-col items-end'>
            <button
              className='flex items-center justify-center w-24 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
              aria-label='Add new entry'
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

export default SubscriptionForm
