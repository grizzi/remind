import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAppContext } from '../context'

import SubscriptionCardView from '../components/views/SubscriptionCardView'

const SubscriptionsPage = () => {
  const context = useAppContext()
  const subscriptions = context.getSubscriptions()

  const [addSubscription, setAddSubscription] = useState<boolean>(false)
  const [focusSubscriptionId, setFocusSubscriptionId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    context.updateSubscriptions()
  }, [])

  if (!subscriptions) {
    return <div>Loading...</div>
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
