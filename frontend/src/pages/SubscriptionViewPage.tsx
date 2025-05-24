import { Api } from '../api/api'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import {
  Subscription,
  UserSettings,
  Currency,
  Plan,
  Label,
} from '../api/schema'
import { useAppContext } from '../context'
import EditablePlanTable from '../components/views/EditableTablePlan'
import { TbEdit } from 'react-icons/tb'
import TagDisplay from '../components/shared/TagDisplay'

const SubscriptionViewPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

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

  useEffect(() => {
    const fetchAndUpdate = async () => {
      context
        .getUserSettings()
        .then(settings => {
          setSettings(settings)
        })
        .catch(err => {
          console.error(err)
        })

      context
        .getCurrencies()
        .then(curr => {
          setCurrencies(curr)
        })
        .catch(err => {
          console.error(err)
        })
    }

    fetchAndUpdate()
  }, [])

  if (!settings || !currencies || loading) {
    return <div></div>
  }

  if (subId !== 'new' && !subscription) {
    navigate('/subscriptions')
    return <div></div>
  }

  return (
    <div>
      <div className='mb-6 flex flex-row justify-between items-center mb-6'>
        <p className='text-3xl'>{`${subscription?.title}`}</p>
        <button
          onClick={() => navigate(`/subscriptions/${subscription?.id}/edit`)}
        >
          <TbEdit className='px-2 size-10 text-purple-700 hover:text-purple-200 transition-all' />
        </button>
      </div>

      <div className='justify-start items-start'>
        <TagDisplay
          labels={labels.filter(l => l.subscription === subscription?.id)}
        />
      </div>

      <div className='flex flex-col w-full'>
        {subscription?.id && (
          <div>
            <EditablePlanTable
              subscription={subscription}
              plans={plans}
              settings={settings}
              currencies={currencies}
              onUpdate={async plan => {
                await Api.updatePlan(subscription!.id, plan)
              }}
              onDelete={plan => Api.deletePlan(subscription!.id, plan)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionViewPage
