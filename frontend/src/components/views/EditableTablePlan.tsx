import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import {
  Plan,
  PlanSchema,
  Currency,
  UserSettings,
  Subscription,
} from '../../api/schema'
import { toFormikValidate } from '../../shared/zod_utilities'
import TextField from '../inputs/TextField'
import SelectField from '../inputs/SelectField'
import CheckboxField from '../inputs/CheckboxField'
import DateField from '../inputs/DateField'
import TimedParagraph from '../shared/TimedParagraph'

type EditablePlanTableProps = {
  subscription?: Subscription
  plans: Plan[]
  settings: UserSettings
  currencies: Currency[]
  onUpdate: (plan: Plan) => Promise<void>
  onDelete: (plan: Plan) => Promise<void>
}

type PopupInfo = {
  when: number
  reason: string
}

const EditablePlanTable: React.FC<EditablePlanTableProps> = ({
  subscription,
  plans,
  settings,
  currencies,
  onUpdate,
  onDelete,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedPlans, setEditedPlans] = useState<Plan[]>([])
  const [submissionSuccess, setSubmissionSuccess] = useState<PopupInfo | null>(
    null,
  )
  const [submissionError, setSubmissionError] = useState<PopupInfo | null>(null)

  const currenciesOptions = currencies.map(c => ({
    value: c.code,
    label: c.code,
  }))

  const billingOptions = ['daily', 'weekly', 'monthly', 'yearly'].map(b => ({
    value: b,
    label: b.charAt(0).toUpperCase() + b.slice(1),
  }))

  useEffect(() => {
    setEditedPlans([...plans])
  }, [])

  return (
    <div>
      {submissionError && (
        <TimedParagraph
          variant='error'
          key={submissionError.when}
          text={submissionError.reason}
        />
      )}

      {submissionSuccess && (
        <TimedParagraph
          variant='success'
          key={submissionSuccess.when}
          text={submissionSuccess.reason}
        />
      )}

      <p className='text-xl mt-2 mb-2'>Plans</p>
      <button
        className='flex items-center justify-center w-24 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
        onClick={() => {
          setEditedPlans([
            {
              subscription: subscription?.id,
              auto_renew: false,
              start_date: new Date(),
              end_date: new Date(),
              cost: 0,
              cost_currency: settings?.budget_currency || 'USD',
              billing_frequency: 'monthly',
            },
            ...editedPlans,
          ])
        }}
      >
        Add Plan
      </button>

      {editedPlans.length === 0 && (
        <div>
          <p className='text-gray-500 italic'>
            No plans available for this subscription
          </p>
        </div>
      )}
      {editedPlans.length > 0 && (
        <div className='overflow-x-auto rounded-2xl shadow-2xl max-w-600'>
          <div className='grid grid-cols-7 gap-4 bg-gray-100 p-2 items-center'>
            <div className='flex flex-row justify-center'>Auto Renew</div>
            <div className='flex flex-row justify-center'>Start Date</div>
            <div className='flex flex-row justify-center'>End Date</div>
            <div className='flex flex-row justify-center'>Cost</div>
            <div className='flex flex-row justify-center'>Currency</div>
            <div className='flex flex-row justify-center'>
              Billing Frequency
            </div>
            <div className='flex flex-row justify-center'>Actions</div>
          </div>

          {/* Rows */}
          {editedPlans.map((plan, index) => (
            <Formik
              key={index}
              initialValues={plan}
              enableReinitialize
              validate={toFormikValidate(PlanSchema)}
              onSubmit={values => {
                onUpdate(values)
                  .then(() => setEditingIndex(null))
                  .then(() =>
                    setSubmissionSuccess({
                      reason: 'Plan updated',
                      when: Date.now(),
                    }),
                  )
                  .catch(err =>
                    setSubmissionError({
                      reason: `Failed to update the plan: ${err}`,
                      when: Date.now(),
                    }),
                  )
              }}
            >
              <Form className='grid grid-cols-7 gap-4 items-start p-2 mt-2'>
                <div className='max-w-28'>
                  <CheckboxField id='auto_renew' />
                </div>
                <DateField id='start_date' />
                <DateField id='end_date' />
                <TextField id='cost' />
                <SelectField
                  id='cost_currency'
                  options={currenciesOptions}
                />
                <SelectField
                  id='billing_frequency'
                  options={billingOptions}
                />
                <div className='flex gap-2'>
                  <button
                    type='submit'
                    className='text-green-600 hover:underline'
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      onDelete(plan)
                      setEditedPlans(editedPlans.filter((_, i) => i !== index))
                      setEditingIndex(null)
                      setSubmissionSuccess({
                        reason: 'Plan deleted',
                        when: Date.now(),
                      })
                    }}
                    className='text-gray-500 hover:underline'
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          ))}
        </div>
      )}
    </div>
  )
}

export default EditablePlanTable
