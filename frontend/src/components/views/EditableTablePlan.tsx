import React, { useEffect, useState, useRef } from 'react'
import { Formik, Form, FormikProps } from 'formik'
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
import { FaEdit, FaSave } from 'react-icons/fa'
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
  const formikRefs = useRef<{ [key: number]: FormikProps<any> | null }>({})

  const [editedPlans, setEditedPlans] = useState<Plan[]>([])
  const [editedIndex, setEditedIndex] = useState<number | null>()
  const [beingEdited, setBeingEdited] = useState(false)

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handlePlanSave = async (index: number) => {
    const formik = formikRefs.current[index]
    if (formik) {
      await formik.submitForm()
    }

    // refresh plans
    // setTimeout(() => {
    //   Api.getPlans(String(subscription?.id!))
    //     .then(plans => {
    //       setEditedPlans(plans)
    //     })
    //     .catch(error =>
    //       console.error(`Failed to get subscription plans: ${error.message}`),
    //     )
    // }, 1000)

    console.log('Refreshing plans')
    console.log('Subscription ID: ', subscription?.id)
  }

  const handlePlanDelete = (index: number) => {
    onDelete(editedPlans[index])
    setEditedIndex(null)
    setEditedPlans(editedPlans.filter((_, i) => i !== index))
  }

  const handlePlanEdit = (index: number) => {
    if (editedIndex !== null && beingEdited) {
      return
    }
    setEditedIndex(index)
    setBeingEdited(true)
  }

  const Menu = ({ index }: { index: number }) => {
    return (
      <div className='ml-6 flex flex-row gap-3'>
        <div className='flex gap-2 justify-center items-center'>
          {index !== editedIndex && (
            <button
              type='button'
              className='text-green-600 hover:underline'
              onClick={() => handlePlanEdit(index)}
            >
              <FaEdit className='m-2 text-xl' />
            </button>
          )}

          {index === editedIndex && (
            <button
              type='button'
              className='text-green-600 hover:underline'
              onClick={() => handlePlanSave(index)}
            >
              <FaSave className='m-2 text-xl' />
            </button>
          )}
          <div className='flex justify-center items-center'>
            <button
              type='button'
              onClick={() => handlePlanDelete(index)}
              className='text-gray-500 hover:underline'
            >
              <MdDeleteOutline className='m-2 text-xl' />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const EditableTableRow = ({ plan, index }: { plan: Plan; index: number }) => {
    return (
      <div>
        <Formik
          key={index}
          innerRef={instance => {
            formikRefs.current[index] = instance
          }}
          initialValues={plan}
          enableReinitialize
          validate={toFormikValidate(PlanSchema)}
          onSubmit={values => {
            console.log('Submitting the following plan: ', values)
            onUpdate(values)
              .then(() => setEditedIndex(null))
              .then(() => toast.success('Plan updated successfully'))
              .then(() => {
                // add plan to the list
                setEditedPlans(
                  editedPlans.map((p, i) => (i === index ? values : p)),
                )
                setEditedIndex(null)
                setBeingEdited(false)
              })
              .catch(err =>
                toast.error(`Could not update plan: ${err.message}`),
              )
          }}
        >
          <Form className='grid grid-cols-7 gap-2 items-start p-2 mt-1'>
            <TextField id='name' />
            <DateField id='start_date' />
            <DateField id='end_date' />
            <NumericField id='cost' />
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
            <SelectField id='billing_frequency' options={billingOptions} />
            <div className='w-full'>
              <CheckboxField id='auto_renew' />
            </div>
            <Menu index={index} />
          </Form>
        </Formik>
      </div>
    )
  }

  const SimpleTableRow = ({ plan, index }: { plan: Plan; index: number }) => {
    return (
      <div className='grid grid-cols-7 gap-2 items-start p-2 mt-1'>
        <div className='flex justify-center'>{plan.name}</div>
        <div className='flex justify-center'>{plan.start_date}</div>
        <div className='flex justify-center'>{plan.end_date}</div>
        <div className='flex justify-center'>
          {plan.cost} {plan.cost_currency}
        </div>
        <div className='flex justify-center'>
          {plan.billing_frequency!.charAt(0).toUpperCase() +
            plan.billing_frequency!.slice(1)}
        </div>
        <div className='flex justify-center'>{`${plan.auto_renew}`}</div>
        <Menu index={index} />
      </div>
    )
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
    <div>
      <div className='overflow-x-auto flex flex-col gap-2'>
        {editedPlans.length === 0 && (
          <div>
            <p className='text-gray-500 italic'>
              No plans available for this subscription
            </p>
          </div>
        )}
        {editedPlans.length > 0 && (
          <div className='min-w-300'>
            <div className='grid grid-cols-7 gap-4 bg-gray-100 p-1 items-center'>
              <div className='flex flex-row justify-center'>Name</div>
              <div className='flex flex-row justify-center'>Start Date</div>
              <div className='flex flex-row justify-center'>End Date</div>
              <div className='flex flex-row justify-center'>Cost</div>
              <div className='flex flex-row justify-center'>
                Billing Frequency
              </div>
              <div className='flex flex-row justify-center'>Auto Renew</div>
            </div>

            {/* Rows */}
            {editedPlans.map((plan, index) =>
              editedIndex !== null && editedIndex === index ? (
                <EditableTableRow plan={plan} index={index} />
              ) : (
                <SimpleTableRow plan={plan} index={index} />
              ),
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col items-end justify-center'>
        <button
          className='flex items-center justify-center w-24 h-10 bg-purple-300 text-white rounded-2xl shadow-lg hover:bg-purple-600 transition-all'
          onClick={() => {
            if (beingEdited) {
              toast.error('Please save or cancel the current edit first')
              return
            }
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
            setEditedIndex(0)
            setBeingEdited(true)
          }}
        >
          Add Plan
        </button>
      </div>
    </div>
  )
}

export default EditablePlanTable
