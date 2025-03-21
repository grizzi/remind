import SubscriptionForm from '../components/forms/SubscriptionForm'
import { Api } from '../api/api'
import { Navigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import {
  Subscription,
  SubscriptionReadWrite,
  UserSettings,
  Currency,
  Label,
} from '../api/schema'
import { useAppContext } from '../context'

const SubscriptionEditPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])

  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])

  const [editing, setEditing] = useState(true)

  console.log('Subscription Edit Page')

  useEffect(() => {
    const id = Number(subId)

    const forceUpdate = true
    context.getSubscriptions(forceUpdate).then(subs => {
      console.log("Getting all subscriptions!")
      console.log(JSON.stringify(subs))
      setSubscription(subs.find(sub => sub.id === id))
      console.log("Subscription is now set!")
    })

    context.getLabels().then(l => setLabels(l))
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
          alert(
            `Failed to create subscription!: ${JSON.stringify(
              error.response.data,
            )}`,
          )
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
      <h1>Edit Subscription</h1>
      <SubscriptionForm
        settings={settings}
        currencies={currencies}
        subscription={subscription}
        onSubmit={onSubmit}
        labels={labels}
      />
    </div>
  )
}

export default SubscriptionEditPage
