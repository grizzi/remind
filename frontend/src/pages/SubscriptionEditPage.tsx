import SubscriptionForm from '../forms/SubscriptionForm'
import { Api } from '../api/api'
import { useParams } from 'react-router'
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

const SubscriptionEditPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])
  const [_, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const id = Number(subId)

    const forceUpdate = true
    context.getSubscriptions(forceUpdate).then(subs => {
      console.log(JSON.stringify(subs))
      setSubscription(subs.find(sub => sub.id === id))
      console.log('Subscription is now set!')
    })

    context.getLabels().then(l => setLabels(l))

    console.log('Sub Id is: ', subId)
    if (subId !== 'new') {
      console.log('Fetching plans!!!')
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

  const onSubmit = async (
    subscription: SubscriptionReadWrite,
  ): Promise<void> => {
    const id = Number(subId)
    if (id === undefined || isNaN(id)) {
      Api.createSubscription(subscription)
        .then(subscription => {
          navigate(`/subscriptions/${subscription.id}`)
        })
        .catch(error => {
          console.error(
            `Failed to create subscription!: ${JSON.stringify(error)}`,
          )
        })
    } else {
      Api.updateSubscription(id, subscription)
        .then(() => {
          navigate(`/subscriptions/${subId}`)
        })
        .catch(error => {
          console.error(
            `Failed to update subscription!: ${error.message} ${JSON.stringify(
              error,
            )}`,
          )
        })
    }
  }

  const onDelete = async (): Promise<void> => {
    Api.deleteSubscription(Number(subId!))
      .then(() => {
        navigate('/subscriptions')
      })
      .catch(error => {
        console.error(`Failed to delete subscription!: ${error.message}`)
      })
  }

  if (!settings || !currencies) {
    return <div></div>
  }

  return (
    <div>
      <p className='mb-4 text-3xl'>
        {subscription?.title || 'Add Subscription'}
      </p>
      <div>
        <p className='text-xl mb-2 w-full'>General</p>
        <SubscriptionForm
          settings={settings}
          currencies={currencies}
          subscription={subscription}
          onSubmit={onSubmit}
          onDelete={onDelete}
          labels={labels}
        />
      </div>
    </div>
  )
}

export default SubscriptionEditPage
