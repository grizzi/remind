import { Plan } from '../../api/schema'

import React from 'react'
import {
  FaCalendarAlt,
  FaDollarSign,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarTimes,
} from 'react-icons/fa'

type PlanTableProps = {
  plans: Plan[]
}

const PlansView: React.FC<PlanTableProps> = ({ plans }) => {
  const formatCost = (plan: Plan) =>
    plan.cost > 0 ? `${plan.cost.toFixed(2)}` : 'Free'

  return (
    <div className='overflow-x-auto border-gray-200 shadow-sm'>
      {plans.map((plan, _) => (
        <div className='grid grid-cols-6'>
          <div className='px-4 py-3 flex items-center gap-2'>
            {plan.name === '' ? '(Untitled)' : plan.name}
          </div>
          <div className='min-w-40 px-4 py-3 flex items-center gap-2'>
            {plan.expired ? (
              <>
                <FaTimesCircle className='text-red-500' />
                Expired
              </>
            ) : plan.auto_renew ? (
              <>
                <FaCheckCircle className='text-green-600' />
                Autorenews
              </>
            ) : (
              <>
                <FaCalendarTimes className='text-orange-400' />
                Expires
              </>
            )}
          </div>
          <div className='px-4 py-3 flex items-center gap-2'>
            <FaCalendarAlt className='text-gray-500' />
            {new Date(plan.start_date).toLocaleDateString()}
          </div>
          <div className='px-4 py-3 flex items-center gap-2'>
            <FaCalendarAlt className='text-gray-500' />
            {plan.end_date
              ? new Date(plan.end_date).toLocaleDateString()
              : 'Ongoing'}
          </div>
          <div className='px-4 py-3 flex items-center gap-2'>
            <FaDollarSign className='text-gray-500' />
            {formatCost(plan)}
          </div>
          <div className='px-4 py-3 flex items-center gap-2'>
            <FaRegClock className='text-gray-500' />
            {plan.billing_frequency ?? '—'}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlansView
