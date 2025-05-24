import { useEffect, useState } from 'react'
import { Label, Plan, Subscription } from '../../api/schema'
import { Api } from '../../api/api'
import TagDisplay from '../shared/TagDisplay'

const SubscriptionCardView = ({
  subscription,
  labels,
  onClick,
}: {
  subscription: Subscription
  labels: Label[]
  onClick: () => void
}) => {
  const [plans, setPlans] = useState<Plan[]>([])
  useEffect(() => {
    Api.getPlans(subscription.id.toString()).then(plans => setPlans(plans))
  }, [])

  return (
    <div
      className='mx-auto mt-4 flex h-24 flex-row justify-between items-stretch gap-x-4 rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 hover:bg-blue-50 overflow-hidden'
      key={subscription.title}
      onClick={onClick}
    >
      <div className='flex flex-col justify-around p-1 flex-shrink-0 max-w-[55%]'>
        <p className='text-2xl truncate'>{subscription.title}</p>
        <p className='text-sm text-gray-500 truncate'>
          {plans.length > 0
            ? `Plans: ${plans.map(p => p.name).join(', ')}`
            : 'No plans available'}
        </p>
      </div>

      <div className='flex-shrink-0 flex-grow min-w-0 max-w-[45%]'>
        <TagDisplay labels={labels} />
      </div>
    </div>
  )
}

export default SubscriptionCardView
