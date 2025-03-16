import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAppContext } from '../context'

import { Label, Subscription } from '../api/schema'
import FloatingActionButton from '../components/buttons/FloatingActionButton'

import SubscriptionCardView from '../components/views/SubscriptionCardView'

const SubscriptionsPage = () => {
  const context = useAppContext()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>()
  const [addSubscription, setAddSubscription] = useState<boolean>(false)
  const [labels, setLabels] = useState<Label[]>([])
  const [focusSubscriptionId, setFocusSubscriptionId] = useState<number | null>(
    null,
  )

  useEffect(() => {
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscriptions(subs))
      .catch(err => alert(`Failed to get subscriptions: ${err.message}`))

    context.getLabels().then(l => setLabels(l))
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
      <FloatingActionButton onClick={() => setAddSubscription(true)}/>
      <div>
        <p className='text-4xl'>My Subscriptions</p>
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
              labels={labels.filter(l => l.subscription === sub.id)}
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
