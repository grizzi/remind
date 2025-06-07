import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Label, Plan, Subscription, UserSettings } from '../api/schema'
import { useParams } from 'react-router'
import { Api } from '../api/api'
import { useAppContext } from '../context'
import { HiDotsVertical } from 'react-icons/hi'
import { TbEdit } from 'react-icons/tb'
import PlanCard from '../components/shared/PlanCard'
import DropDownMenu from '../components/shared/DropDownMenu'
import { planExpiredFromDate } from '../shared/TimeUtils'

const SubscriptionViewPage = () => {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription>()
  const [settings, setSettings] = useState<UserSettings>()

  const [loading, setLoading] = useState<boolean>(true)
  const [_, setLabels] = useState<Label[]>([])
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { getSubscriptions, getLabels, getUserSettings } = useAppContext()
  const { subId } = useParams()

  useEffect(() => {
    const id = Number(subId)
    const forceUpdate = true

    const loadData = async () => {
      try {
        const subs = await getSubscriptions(forceUpdate)
        setSubscription(subs.find(sub => sub.id === id))

        const labels_ = await getLabels()
        setLabels(labels_)

        const settings = await getUserSettings()
        setSettings(settings)
        if (subId !== 'new') {
          const plans = await Api.getPlans(subId!)
          setPlans(plans)
        }
      } catch (error: any) {
        console.error(`Failed to load subscription data: ${error.message}`)
        navigate('/subscriptions')
      }
    }

    loadData().then(() => {
      setLoading(false)
    })
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

  if (loading) {
    return <></>
  }

  return (
    <div>
      <div className='mb-6 flex flex-row justify-between items-center'>
        <p className='text-2xl mb-6'>{`${subscription?.title}`}</p>
        <button onClick={() => navigate(`/subscriptions/${subId}/edit`)}>
          <TbEdit className='px-2 size-10 text-purple-700 dark:text-white hover:text-purple-200 transition-all' />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg ${
              plan.expired || planExpiredFromDate(plan)
                ? 'bg-red-50 dark:bg-gray-100 border border-red-200 dark:border-red-300'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-900'
            }`}
          >
            {/* Dropdown Trigger */}
            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
              onClick={e => {
                e.stopPropagation()
                setOpenDropdown(
                  openDropdown === plan.id ? null : plan.id ?? null,
                )
              }}
            >
              <HiDotsVertical />
            </button>

            {/* Dropdown Menu */}
            {openDropdown === plan.id && (
              <DropDownMenu
                outerDivRef={dropdownRef}
                onEdit={() =>
                  navigate(`/subscriptions/${subId}/plans/${plan.id}/edit`)
                }
                onDelete={() =>
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
                }
              />
            )}

            {/* Card Content */}
            {/* Overwrite currency from global settings since we do not handle multicurrency
              yet */}
            <PlanCard
              plan={{
                ...plan,
                cost_currency: settings!.budget_currency,
              }}
            />
          </div>
        ))}

        {plans.length === 0 && (
          <div className='col-span-1 sm:col-span-2 lg:col-span-3 p-6 bg-gray-100 rounded-lg text-center'>
            <p className='text-gray-600'>
              No plans available for this subscription.
            </p>
          </div>
        )}

        <div className='fixed bottom-8 right-6'>
          <button
            className='items-center justify-center w-24 h-10 bg-purple-600 md:bg-purple-300 text-white rounded-sm shadow-lg hover:bg-purple-600 transition-all'
            aria-label={`Button: Add plan`}
            type='button'
            onClick={() => navigate(`/subscriptions/${subId}/plans/new/edit`)}
          >
            Add plan
          </button>
        </div>
      </div>
    </div>
  )
}
export default SubscriptionViewPage
