import { useEffect, useState } from 'react'
import { Api } from '../api/api'
import { Subscription } from '../api/schema'
import { useNavigate } from 'react-router'
import SubscriptionView from '../components/views/SubscriptionView'
import { useAppContext } from '../context'

const Home = () => {
  const context = useAppContext()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [detailedSubscription, setDetailedSubscription] =
    useState<Subscription | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    Api.getSubscriptions()
      .then(data => setSubscriptions(data))
      .catch(error => alert(error.message))
  }, [])
  return (
    <div>
      <button onClick={() => navigate('/settings')}>Settings</button>
      <button
        onClick={() => {
          context!.setCurrentSubscription(undefined)
          navigate('/edit')
        }}
      >
        Add Subscription
      </button>
      <button onClick={() => setDetailedSubscription(null)}>
        {detailedSubscription ? 'Back' : 'Home'}
      </button>
      {detailedSubscription === null ? (
        <div>
          <h1>Summary</h1>
          {subscriptions.map(sub => (
            <div key={sub.title}>
              <button onClick={() => setDetailedSubscription(sub)}>
                Expand
              </button>
              <p>{JSON.stringify(sub)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              context?.setCurrentSubscription(detailedSubscription)
              navigate('/edit')
            }}
          >
            Edit
          </button>
          <SubscriptionView subscription={detailedSubscription!} />
        </div>
      )}
    </div>
  )
}

export default Home
