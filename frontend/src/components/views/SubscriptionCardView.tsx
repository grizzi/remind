import { Subscription } from "../../api/schema"

const SubscriptionCardView = ({subscription, onClick} : {subscription: Subscription, onClick: () => void}) =>{
    return (
      <div key={subscription.title} onClick={onClick}>
        <p>{subscription.title}</p>
        <p>
          {subscription.amount} 
          {subscription.amount_currency}
        </p>
      </div>
    )    
}

export default SubscriptionCardView;

