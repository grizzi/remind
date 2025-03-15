import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import SubscriptionView from '../components/views/SubscriptionView'
import { useAppContext } from '../context'
import { Subscription } from '../api/schema'

const SubscriptionViewPage = () => {
  const [subscription, setSubscription] = useState<Subscription>()
  const { subId } = useParams()
  const context = useAppContext()


  console.log('Subscription View Page')
  useEffect(() => {
    const fetchAndUpdate = async () => {
      await context.updateSubscriptions()
    }

    fetchAndUpdate()
  }, [])

  useEffect(() => {
    const sub = context!
      .getSubscriptions()
      .find(sub => sub.id === Number(subId))
    setSubscription(sub)
  }, [context.getSubscriptions(), subId])

  if (!subscription) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SubscriptionView subscription={subscription} />
    </div>
  )
}

export default SubscriptionViewPage
