import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Label, Plan, Subscription } from '../api/schema'
import { useParams } from 'react-router'
import { Api } from '../api/api'
import { useAppContext } from '../context'
import { HiDotsVertical } from 'react-icons/hi'

const SubscriptionViewPage = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription>()
  const [loading, setLoading] = useState<boolean>(true)
  const [labels, setLabels] = useState<Label[]>([])
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const context = useAppContext()
  const { subId } = useParams()

  useEffect(() => {
    const id = Number(subId)
    const forceUpdate = true
    context.getSubscriptions(forceUpdate).then(subs => {
      setSubscription(subs.find(sub => sub.id === id))
      setLoading(false)
    })
    context.getLabels().then(l => setLabels(l))

    if (subId !== 'new') {
      Api.getPlans(subId!)
        .then(plans => setPlans(plans))
        .catch(error =>
          console.error(`Failed to get subscription plans: ${error.message}`),
        )
    }
  }, [subId])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDelete = async (planId: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await Api.deletePlan(planId)
        setPlans(plans.filter(p => p.id !== planId))
      } catch (err) {
        console.error('Failed to delete plan:', err)
      }
    }
  }

  const DropDownMenu = ({ plan }: { plan: Plan }) => {
    return (
      <div
        ref={dropdownRef}
        className='absolute top-10 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32'
      >
        <button
          onClick={e => {
            e.stopPropagation()
            navigate(`/subscriptions/${subId}/plans/${plan.id}/edit`)
          }}
          className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100'
        >
          Edit
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            Api.deletePlan(Number(subId), plan)
              .then(() => {
                setPlans(plans.filter(p => p.id !== plan.id))
              })
              .catch(error => {
                console.error(`Failed to delete plan: ${error.message}`)
              })
              .finally(() => {
                setOpenDropdown(null)
              })
          }}
          className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50'
        >
          Delete
        </button>
      </div>
    )
  }

  const PlanCard = ({ plan }: { plan: Plan }) => {
    return (
      <div>
        <div className='flex justify-between items-center mb-2'>
          <h2 className='text-lg font-semibold'>{plan.name}</h2>
          {plan.renewed && (
            <span className='text-green-600 text-sm font-medium'>Renewed</span>
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
          {plan.expired && (
            <span className='text-xs font-semibold text-red-600'>Expired</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='p-4 md:p-8'>
      <h1 className='text-2xl font-bold mb-6'>Subscription Overview</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg ${
              plan.expired
                ? 'bg-red-50 border border-red-200'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Dropdown Trigger */}
            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
              onClick={e => {
                e.stopPropagation()
                setOpenDropdown(openDropdown === plan.id ? null : plan.id)
              }}
            >
              <HiDotsVertical />
            </button>

            {/* Dropdown Menu */}
            {openDropdown === plan.id && <DropDownMenu plan={plan} />}

            {/* Card Content */}
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SubscriptionViewPage
