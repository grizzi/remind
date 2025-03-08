import { useEffect, useState } from 'react'
import { Subscription } from '../api/schema'
import { useNavigate } from 'react-router'
import { useAppContext } from '../context'

import SubscriptionView from '../components/views/SubscriptionView'
import SubscriptionCardView from '../components/views/SubscriptionCardView'

const Home = () => {
  const context = useAppContext()
  const subscriptions = context?.getSubscriptions()

  const [detailedSubscription, setDetailedSubscription] =
    useState<Subscription | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    context?.updateSubscriptions()
  }, [])

  if (!subscriptions) {
    return <div>Loading...</div>
  }

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
          {subscriptions.sort((a, b) => {
            if (a.created_at < b.created_at){
              return -1
            }
            if (a.created_at > b.created_at) {
              return 1
            } 
            if (a.id < b.id){
              return -1
            }
            if (a.id > b.id){
              return 1
            }
            return 0;
          }).map(sub => (
            <SubscriptionCardView
              subscription={sub}
              onClick={() => setDetailedSubscription(sub)}
            />
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              console.log('Setting current subscription')
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
