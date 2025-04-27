import { Plan } from '../../api/schema'

import React from 'react'
import {
  FaDollarSign,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarTimes,
  FaRegCalendarTimes,
  FaRegCalendarPlus,
} from 'react-icons/fa'

import { ParseDate } from '../../shared/TimeUtils'

type PlanTableProps = {
  plans: Plan[]
}

const PlansView: React.FC<PlanTableProps> = ({ plans }) => {
  const formatCost = (plan: Plan) =>
    plan.cost > 0 ? `${plan.cost.toFixed(2)}` : 'Free'

  return (
    <div className='overflow-x-auto'>
      {plans
        .sort((a, b) => ParseDate(a.end_date) - ParseDate(b.end_date))
        .map((plan, _) => (
          <div className='grid grid-cols-2 md:grid-cols-6'>
            <div className='col-span-2 md:col-span-6 px-4 py-3 flex items-center gap-2'>
              <p className='font-semibold'>
                {plan.name === '' ? '(Untitled)' : plan.name}
              </p>
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
              <FaDollarSign className='text-gray-500' />
              {formatCost(plan)}
            </div>
            <div className='px-4 py-3 flex items-center gap-2'>
              <FaRegCalendarPlus className='text-gray-500' />
              {new Date(plan.start_date).toLocaleDateString('de-CH')}
            </div>
            <div className='px-4 py-3 flex items-center gap-2'>
              <FaRegCalendarTimes className='text-gray-500' />
              {plan.end_date
                ? new Date(plan.end_date).toLocaleDateString('de-CH')
                : 'Ongoing'}
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
