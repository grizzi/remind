import { useEffect, useState } from 'react'
import { Label, Plan, Subscription } from '../../api/schema'
import TagChip from '../shared/TagChip'
import { Api } from '../../api/api'

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
      className='mx-auto mt-4 flex flex-row justify-between h-24 items-stretch gap-x-4 rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 hover:bg-blue-50'
      key={subscription.title}
      onClick={onClick}
    >
      <div className='flex flex-col justify-around p-1'>
        <p className='text-2xl'>{subscription.title}</p>
        <p className=''>
          {plans.length > 0 ? (
            <p>
              {plans[0].cost} {plans[0].cost_currency}
            </p>
          ) : (
            <></>
          )}
        </p>
      </div>
      <div className='flex flex-wrap justify-end items-start p-2'>
        {labels.map(l => (
          <TagChip name={l.name} />
        ))}
      </div>
    </div>
  )
}

export default SubscriptionCardView
