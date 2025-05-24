import { Formik, Form } from 'formik'
import { Plan, PlanSchema, BillingFrequencySchema } from '../../api/schema'
import { toFormikValidate } from '../../shared/zod_utilities'
import TextField from '../inputs/TextField'
import SelectField from '../inputs/SelectField'
import CheckboxField from '../inputs/CheckboxField'
import DateField from '../inputs/DateField'
import NumericField from '../inputs/NumericField'
import SimpleButton from '../buttons/SimpleButton'

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
          <DateField id='start_date' label='Start Date' />
          <DateField id='end_date' label='End Date' />
          <NumericField id='cost' label={`Cost (${plan.cost_currency})`} />
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
          <SelectField id='billing_frequency' options={billingOptions} label="Billing frequency"/>
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
