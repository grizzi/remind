import React from 'react'
import { Plan } from '../../api/schema'

type Props = {
  plans: Plan[]
  onEdit: (plan: Plan, index: number) => void
  onDelete: (plan: Plan, index: number) => void
}

const PlansTable: React.FC<Props> = ({ plans, onEdit, onDelete }) => {
  const formatDate = (date?: Date) =>
    date ? new Date(date).toLocaleDateString() : '—'

  const formatCost = (plan: Plan) =>
    plan.cost && plan.cost_currency
      ? `${plan.cost.toFixed(2)} ${plan.cost_currency}`
      : 'Free'

  const getStatusLabel = (plan: Plan) => {
    const now = new Date()
    if (plan.end_date && new Date(plan.end_date) < now) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' }
    }
    if (plan.auto_renew) {
      return { label: 'Auto-renew', color: 'bg-green-100 text-green-800' }
    }
    return { label: 'Manual', color: 'bg-yellow-100 text-yellow-800' }
  }

  return (
    <div className='overflow-x-auto rounded-2xl shadow-xl '>
      <table className='min-w-full text-sm text-left text-gray-700'>
        <thead className='text-xs uppercase bg-gray-50 text-gray-500'>
          <tr>
            <th className='px-6 py-3'>Subscription ID</th>
            <th className='px-6 py-3'>Start Date</th>
            <th className='px-6 py-3'>End Date</th>
            <th className='px-6 py-3'>Billing</th>
            <th className='px-6 py-3'>Cost</th>
            <th className='px-6 py-3'>Status</th>
            <th className='px-6 py-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => {
            const status = getStatusLabel(plan)
            return (
              <tr key={index} className=' hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4'>
                  {plan.subscription ?? (
                    <span className='text-gray-400'>—</span>
                  )}
                </td>
                <td className='px-6 py-4'>{formatDate(plan.start_date)}</td>
                <td className='px-6 py-4'>{formatDate(plan.end_date)}</td>
                <td className='px-6 py-4 capitalize'>
                  {plan.billing_frequency ?? '—'}
                </td>
                <td className='px-6 py-4'>{formatCost(plan)}</td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className='px-6 py-4 flex gap-2'>
                  <button
                    onClick={() => onEdit(plan, index)}
                    className='text-blue-600 hover:underline'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(plan, index)}
                    className='text-red-600 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
          {plans.length === 0 && (
            <tr>
              <td colSpan={7} className='px-6 py-4 text-center text-gray-400'>
                No plans available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PlansTable
