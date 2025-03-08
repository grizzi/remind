import { Subscription } from '../../api/schema'

const SubscriptionView = ({ subscription }: { subscription: Subscription }) => {
  return (
    <div>
      <h1>{subscription.title}</h1>
    </div>
  )
}

export default SubscriptionView
