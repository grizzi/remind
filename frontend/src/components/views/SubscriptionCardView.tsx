import { Label, Subscription } from '../../api/schema'

const SubscriptionCardView = ({
  subscription,
  labels,
  onClick,
}: {
  subscription: Subscription
  labels: Label[]
  onClick: () => void
}) => {
  return (
    <div key={subscription.title} onClick={onClick}>
      <p>{subscription.title}</p>
      <p>
        {subscription.amount}
        {subscription.amount_currency}
      </p>
      <ul>
        {labels.map(l => (
          <li>{l.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default SubscriptionCardView
