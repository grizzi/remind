import SubscriptionForm from '../components/forms/SubscriptionForm'

const EditSubscription = () => {
  const onSubmit = () => {}

  return (
    <div>
      <h1>Edit Subscription</h1>
      <SubscriptionForm onSubmit={onSubmit} />
    </div>
  )
}

export default EditSubscription
