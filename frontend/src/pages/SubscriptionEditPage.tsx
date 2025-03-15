import SubscriptionForm from '../components/forms/SubscriptionForm'
import { Api } from '../api/api'
import { Navigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import { Subscription, SubscriptionReadWrite } from '../api/schema'
import { useAppContext } from '../context'

const SubscriptionEditPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [editing, setEditing] = useState(true)

  console.log('Subscription Edit Page')
  useEffect(() => {
    const fetchAndUpdate = async () => {
      await context.updateSubscriptions()
    }

    fetchAndUpdate()

    if (subId) {
      const id = Number(subId)
      if (id !== undefined) {
        const sub = context
          .getSubscriptions()
          .find(sub => sub.id === Number(subId))
        console.log('Found subscription: ' + JSON.stringify(sub))
        setSubscription(sub)
      }
    }
  }, [subId])

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
            `Failed to create subscription!: ${error.message} ${JSON.stringify(
              error,
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

  return (
    <div>
      <h1>Edit Subscription</h1>
      <SubscriptionForm subscription={subscription} onSubmit={onSubmit} />
    </div>
  )
}

export default SubscriptionEditPage
