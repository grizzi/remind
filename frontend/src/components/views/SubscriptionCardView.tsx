import { Label, Subscription } from '../../api/schema'
import TagChip from '../shared/TagChip'

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
    <div
      className='mx-auto mt-4 flex flex-row justify-between h-22 items-stretch gap-x-4 rounded-xl bg-white p-1 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 hover:bg-blue-50'
      key={subscription.title}
      onClick={onClick}
    >
      <div className='flex flex-col justify-around p-1'>
        <p className='text-2xl'>{subscription.title}</p>
        <p className=''>
          {`${subscription.amount} ${subscription.amount_currency}`}
        </p>
      </div>
      <div className='flex flex-wrap justify-end items-start max-w-48'>
        {labels.map(l => (
          <TagChip name={l.name} />
        ))}
      </div>
    </div>
  )
}

export default SubscriptionCardView
