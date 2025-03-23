import SubscriptionForm from '../components/forms/SubscriptionForm'
import { Api } from '../api/api'
import { Navigate, Outlet, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import {
  Subscription,
  SubscriptionReadWrite,
  UserSettings,
  Currency,
  Label,
  Plan,
} from '../api/schema'
import { useAppContext } from '../context'
import PlansView from '../components/views/PlansView'
import PlanForm from '../components/forms/PlanForm'

const SubscriptionEditPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [editingPlan, setEditingPlan] = useState<boolean>(false)

  const [editing, setEditing] = useState(true)

  useEffect(() => {
    const id = Number(subId)

    const forceUpdate = true
    context.getSubscriptions(forceUpdate).then(subs => {
      console.log('Getting all subscriptions!')
      console.log(JSON.stringify(subs))
      setSubscription(subs.find(sub => sub.id === id))
      console.log('Subscription is now set!')
    })

    context.getLabels().then(l => setLabels(l))

    if (subId) {
      Api.getPlans(subId)
        .then(plans => setPlans(plans))
        .catch(error =>
          alert(`Failed to get subscription plans: ${error.message}`),
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
          alert(err)
        })

      context
        .getCurrencies()
        .then(curr => {
          setCurrencies(curr)
        })
        .catch(err => {
          alert(err)
        })
    }

    fetchAndUpdate()
  }, [])

  const onSubmit = async (
    subscription: SubscriptionReadWrite,
  ): Promise<void> => {
    const id = Number(subId)
    if (id === undefined || isNaN(id)) {
      Api.createSubscription(subscription)
        .then(() => {
          setEditing(false)
        })
        .catch(error => {
          alert(`Failed to create subscription!: ${JSON.stringify(error)}`)
        })
    } else {
      Api.updateSubscription(id, subscription)
        .then(() => {
          setEditing(false)
        })
        .catch(error => {
          alert(
            `Failed to update subscription!: ${error.message} ${JSON.stringify(
              error,
            )}`,
          )
        })
    }
  }

  if (!editing) {
    return <Navigate to={'/subscriptions'} />
  }

  if (!settings || !currencies) {
    return <div></div>
  }

  return (
    <div>
      <p className='mb-4 text-3xl'>Edit Subscription</p>
      <div className='flex flex-col'>
        <div>
          <p className='text-xl'>General</p>
          <SubscriptionForm
            settings={settings}
            currencies={currencies}
            subscription={subscription}
            onSubmit={onSubmit}
            labels={labels}
          />
        </div>

        <div>
          <p className='text-xl'>Plans</p>
          {plans.map(p => (
            <PlanForm
              currentPlan={p}
              settings={settings}
              currencies={currencies}
              onSave={() => {}}
              onDiscard={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionEditPage
