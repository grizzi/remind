import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import SubscriptionView from '../components/views/SubscriptionView'
import { useAppContext } from '../context'
import { Subscription } from '../api/schema'

const SubscriptionViewPage = () => {
  const [subscription, setSubscription] = useState<Subscription>()
  const { subId } = useParams()
  const context = useAppContext()

  useEffect(() => {
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscription(subs.find(sub => sub.id === Number(subId))))
      .catch(err => alert(err.message))
  }, [])

  if (!subscription) {
    return <div></div>
  }

  return (
    <div>
      <SubscriptionView subscription={subscription} />
    </div>
  )
}

export default SubscriptionViewPage
