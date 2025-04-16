import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

import SubscriptionView from '../components/views/SubscriptionView'
import PlansView from '../components/views/PlansView'

import { useAppContext } from '../context'
import { Label, Plan, Subscription } from '../api/schema'
import { Api } from '../api/api'

const SubscriptionViewPage = () => {
  const [subscription, setSubscription] = useState<Subscription>()
  const [labels, setLabels] = useState<Label[]>([])
  const [plans, setPlans] = useState<Plan[]>([])

  const { subId } = useParams()
  const context = useAppContext()

  useEffect(() => {
    const id = Number(subId)
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscription(subs.find(sub => sub.id === Number(id))))
      .catch(err => console.error(err.message))

    context
      .getLabels()
      .then(l => setLabels(l.filter(l => l.subscription === id)))
      .catch(_ => console.error('Failed to retrieve subscription labels'))

    if (subId) {
      Api.getPlans(subId)
        .then(p => setPlans(p))
        .catch(error =>
          console.error(`Failed to get subscription plans: ${error.message}`),
        )
    }
  }, [])

  if (!subscription) {
    return <div></div>
  }

  return (
    <div>
      <SubscriptionView subscription={subscription} labels={labels} />
      <PlansView plans={plans} />
    </div>
  )
}

export default SubscriptionViewPage
