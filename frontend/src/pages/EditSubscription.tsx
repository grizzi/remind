import SubscriptionForm from '../components/forms/SubscriptionForm'
import { Api } from '../api/api'
import { SubscriptionReadWrite } from '../api/schema'
import { useNavigate } from 'react-router'

const EditSubscription = () => {
  const onSubmit = (
    id: number | undefined,
    subscription: SubscriptionReadWrite,
  ) => {
    if (id === undefined) {
      Api.createSubscription(subscription)
    } else {
      Api.updateSubscription(id, subscription)
    }
  }

  const navigate = useNavigate();

  return (
    <div>
      <h1>Edit Subscription</h1>
      <SubscriptionForm onSubmit={(id, subscription) => {
        onSubmit(id, subscription)
        navigate("/")
      }
        } />
    </div>
  )
}

export default EditSubscription
