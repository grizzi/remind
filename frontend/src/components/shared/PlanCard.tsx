import { Plan } from '../../api/schema'
import { planExpiredFromDate } from '../../shared/TimeUtils'

const PlanCard = ({ plan }: { plan: Plan }) => {
  return (
    <div>
      <div className='flex flex-row items-center mb-2'>
        <h2 className='text-lg font-semibold'>{plan.name}</h2>
        {plan.renewed && (
          <span className='text-green-600 text-sm font-medium ml-4'>
            Renewed
          </span>
        )}
      </div>
      <p className='text-sm text-gray-600 mb-1'>
        {plan.start_date} → {plan.end_date || 'Ongoing'}
      </p>
      <p className='text-sm text-gray-600 mb-2'>
        {plan.cost} {plan.cost_currency} / {plan.billing_frequency ?? '—'}
      </p>
      <div className='flex justify-between items-center'>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            plan.auto_renew
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {plan.auto_renew ? 'Auto-renew ON' : 'Manual Renewal'}
        </span>
        {plan.expired ||
          (planExpiredFromDate(plan) && (
            <span className='text-xs font-semibold text-red-600'>Expired</span>
          ))}
      </div>
    </div>
  )
}

export default PlanCard
