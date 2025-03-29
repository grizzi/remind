import SubscriptionForm from '../components/forms/SubscriptionForm'
import { Api } from '../api/api'
import { Navigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  Subscription,
  SubscriptionReadWrite,
  UserSettings,
  Currency,
  Label,
  Plan,
} from '../api/schema'
import { useAppContext } from '../context'
import EditablePlanTable from '../components/views/EditableTablePlan'

const SubscriptionEditPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [editing, setEditing] = useState<boolean>(true)
  const navigate = useNavigate()

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

    console.log("Sub Id is: ", subId)
    if (subId !== 'new') {
      console.log("Fetching plans!!!")
      Api.getPlans(subId!)
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
        .then(subscription => {
          navigate(`/subscriptions/${subscription.id}/edit/`)
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
      <p className='mb-4 text-3xl'>
        {subscription?.title || 'Add Subscription'}
      </p>
      <div className='flex flex-col'>
        <div>
          <p className='text-xl mb-2'>General</p>
          <SubscriptionForm
            settings={settings}
            currencies={currencies}
            subscription={subscription}
            onSubmit={onSubmit}
            labels={labels}
          />
        </div>

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

export default SubscriptionEditPage
