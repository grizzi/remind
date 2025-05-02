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
import NumericField from '../inputs/NumericField'
import { toast } from 'react-toastify'
import { FaSave } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'

type EditablePlanTableProps = {
  subscription?: Subscription
  plans: Plan[]
  settings: UserSettings
  currencies: Currency[]
  onUpdate: (plan: Plan) => Promise<void>
  onDelete: (plan: Plan) => Promise<void>
}

const EditablePlanTable: React.FC<EditablePlanTableProps> = ({
  subscription,
  plans,
  settings,
  currencies,
  onUpdate,
  onDelete,
}) => {
  const [_, setEditingIndex] = useState<number | null>(null)
  const [editedPlans, setEditedPlans] = useState<Plan[]>([])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // TODO(giuseppe): multicurrency support in the future
  currencies
  // const currenciesOptions = currencies.map(c => ({
  //   value: c.code,
  //   label: c.code,
  // }))

  const billingOptions = ['daily', 'weekly', 'monthly', 'yearly'].map(b => ({
    value: b,
    label: b.charAt(0).toUpperCase() + b.slice(1),
  }))

  useEffect(() => {
    setEditedPlans([...plans])
  }, [])

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-xl mt-2 mb-2'>Plans</p>

      {editedPlans.length === 0 && (
        <div>
          <p className='text-gray-500 italic'>
            No plans available for this subscription
          </p>
        </div>
      )}
      {editedPlans.length > 0 && (
        <div className='overflow-x-auto max-w-600'>
          <div className='grid grid-cols-9 gap-4 bg-gray-100 p-2 items-center'>
            <div className='flex flex-row justify-center'>Name</div>
            <div className='flex flex-row justify-center'>Start Date</div>
            <div className='flex flex-row justify-center'>End Date</div>
            <div className='flex flex-row justify-center'>Cost</div>
            <div className='flex flex-row justify-center'>Currency</div>
            <div className='flex flex-row justify-center'>
              Billing Frequency
            </div>
            <div className='flex flex-row justify-center'>Auto Renew</div>
            <div className='flex flex-row justify-center col-span-2'>
              Actions
            </div>
          </div>

          {/* Rows */}
          {editedPlans.map((plan, index) => (
            <Formik
              key={index}
              initialValues={plan}
              enableReinitialize
              validate={toFormikValidate(PlanSchema)}
              onSubmit={values => {
                console.log('Submitting the following plan: ', values)
                onUpdate(values)
                  .then(() => setEditingIndex(null))
                  .then(() => toast.success('Plan updated successfully'))
                  .catch(err =>
                    toast.success(`Could not update plan: ${err.message}`),
                  )
              }}
            >
              <Form className='grid grid-cols-9 gap-4 items-start p-2 mt-2'>
                <TextField id='name' />
                <DateField id='start_date' />
                <DateField id='end_date' />
                <NumericField id='cost' />
                <SelectField
                  id='cost_currency'
                  // TODO(giuseppe): multicurrency support in the future
                  options={[
                    {
                      value: settings.budget_currency,
                      label: settings.budget_currency,
                    },
                  ]}
                  disabled={true}
                />
                <SelectField id='billing_frequency' options={billingOptions} />

                <div className='w-full'>
                  <CheckboxField id='auto_renew' />
                </div>

                <div className='flex gap-2 justify-center items-center'>
                  <button
                    type='submit'
                    className='text-green-600 hover:underline'
                  >
                    <FaSave className='text-3xl' />
                  </button>
                </div>

                <div className='col-start-9 col-end-9'>
                  <div className='flex justify-center items-center'>
                    <button
                      type='button'
                      onClick={() => {
                        // Can delete only plans that were already saved
                        if (plan.id) {
                          onDelete(plan)
                        }
                        setEditedPlans(
                          editedPlans.filter((_, i) => i !== index),
                        )
                        setEditingIndex(null)
                      }}
                      className='text-gray-500 hover:underline'
                    >
                      <MdDeleteOutline className='text-3xl' />
                    </button>
                  </div>
                </div>
              </Form>
            </Formik>
          ))}
        </div>
      )}

      <div className='flex flex-col items-end justify-center'>
        <button
          className='flex items-center justify-center w-24 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
          onClick={() => {
            setEditedPlans([
              {
                subscription: subscription?.id,
                name: '',
                auto_renew: false,
                start_date: formatDate(new Date()),
                end_date: formatDate(new Date()),
                cost: 0,
                cost_currency: settings.budget_currency,
                billing_frequency: 'monthly',
              },
              ...editedPlans,
            ])
          }}
        >
          Add Plan
        </button>
      </div>
    </div>
  )
}

export default EditablePlanTable
