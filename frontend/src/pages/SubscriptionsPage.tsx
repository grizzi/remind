import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAppContext } from '../context'

import { Subscription } from '../api/schema'
import SubscriptionCardView from '../components/views/SubscriptionCardView'

const SubscriptionsPage = () => {
  const context = useAppContext()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>()
  const [addSubscription, setAddSubscription] = useState<boolean>(false)
  const [focusSubscriptionId, setFocusSubscriptionId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscriptions(subs))
      .catch(err => alert(`Failed to get subscriptions: ${err.message}`))
  }, [])

  if (!subscriptions) {
    return <div></div>
  }

  console.log('Subscriptions Page')
  if (addSubscription) {
    return <Navigate to='/subscriptions/new/edit' />
  }

  if (focusSubscriptionId) {
    return <Navigate to={'/subscriptions/' + focusSubscriptionId} />
  }

  return (
    <div>
      <button onClick={() => setAddSubscription(true)}>Add Subscription</button>
      <div>
        <h1>Summary</h1>
        {subscriptions
          .sort((a, b) => {
            if (a.created_at < b.created_at) {
              return -1
            }
            if (a.created_at > b.created_at) {
              return 1
            }
            if (a.id < b.id) {
              return -1
            }
            if (a.id > b.id) {
              return 1
            }
            return 0
          })
          .map(sub => (
            <SubscriptionCardView
              subscription={sub}
              key={sub.id}
              onClick={() => {
                setFocusSubscriptionId(sub.id)
              }}
            />
          ))}
      </div>
    </div>
  )
}

export default SubscriptionsPage
