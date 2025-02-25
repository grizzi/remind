import { useEffect, useState } from 'react'
import { Api } from '../api/api'
import { Subscription } from '../api/schema'

const Summary = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    Api.getSubscriptions()
      .then(data => setSubscriptions(data))
      .catch(error => console.log(error));
  }, [])
  return (
    <div>
      <h1>Summary</h1>
      <p>{JSON.stringify(subscriptions)}</p>
    </div>
  )
}

export default Summary
