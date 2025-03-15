import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import SubscriptionView from '../components/views/SubscriptionView'
import { useAppContext } from '../context'
import { Label, Subscription } from '../api/schema'

const SubscriptionViewPage = () => {
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])

  const { subId } = useParams()
  const context = useAppContext()

  useEffect(() => {
    const id = Number(subId)
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscription(subs.find(sub => sub.id === Number(id))))
      .catch(err => alert(err.message))

    context.getLabels(id).then(l => setLabels(l))
  }, [])

  if (!subscription) {
    return <div></div>
  }

  return (
    <div>
      <SubscriptionView subscription={subscription} labels={labels} />
    </div>
  )
}

export default SubscriptionViewPage
