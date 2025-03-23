import { Plan } from '../../api/schema'
import { format } from 'date-fns'

const PlanCard = ({ plan }: { plan: Plan }) => {
  return (
    <div className='flex flex-col rounded-2xl shadow-md p-6 bg-white border border-gray-200'>

      {plan.cost && plan.cost_currency ? (
        <p className='text-lg text-gray-700'>
          <span className='font-medium'>Cost:</span> {plan.cost}{' '}
          {plan.cost_currency.toUpperCase()}
        </p>
      ) : (
        <p className='text-gray-500 italic'>No cost specified</p>
      )}

      <p className='text-gray-700'>
        <span className='font-medium'>Auto Renew:</span>{' '}
        {plan.auto_renew ? 'Yes' : 'No'}
      </p>

      <p className='text-gray-700'>
        <span className='font-medium'>Start Date:</span>{' '}
        {format(new Date(plan.start_date), 'PPP')}
      </p>

      {plan.end_date && (
        <p className='text-gray-700'>
          <span className='font-medium'>End Date:</span>{' '}
          {format(new Date(plan.end_date), 'PPP')}
        </p>
      )}

      {plan.billing_frequency && (
        <p className='text-gray-700'>
          <span className='font-medium'>Billing Frequency:</span>{' '}
          {plan.billing_frequency.charAt(0).toUpperCase() +
            plan.billing_frequency.slice(1)}
        </p>
      )}
    </div>
  )
}

const PlansView = ({ plans }: { plans: Plan[] }) => {
  return (
    <div>
      {plans.map(p => (
        <PlanCard plan={p} />
      ))}
    </div>
  )
}

export default PlansView
