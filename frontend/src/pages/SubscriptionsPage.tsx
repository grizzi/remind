import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAppContext } from '../context'

import { Label, Plan, Subscription, UserSettings } from '../api/schema'
import FloatingActionButton from '../components/buttons/FloatingActionButton'

import SubscriptionCardView from '../components/views/SubscriptionCardView'
import { Api } from '../api/api'
import { BillingFrequency } from '../api/schema'

const MetricCard = ({
  header,
  details,
  loadingDetails,
}: {
  header: string
  details: string
  loadingDetails?: boolean
}) => {
  return (
    <div className='flex flex-row bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl p-1 shadow-md w-full m-2'>
      <div className='w-full flex flex-col'>
        <p className='pl-2 pt-2 text-md sm:text-3xl '>{header}</p>

        <div className='flex flex-row justify-end min-h-[2.5rem] p-1 mr-2'>
          {!loadingDetails ? (
            <p className='text-sm sm:text-xl'>{details}</p>
          ) : (
            <div className='h-6 w-32 animate-pulse opacity-0 rounded-md bg-white/50 backdrop-blur-2xl shadow-inner' />
          )}
        </div>
      </div>
    </div>
  )
}

const SubscriptionsPage = () => {
  const context = useAppContext()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>()
  const [addSubscription, setAddSubscription] = useState<boolean>(false)
  const [labels, setLabels] = useState<Label[]>([])
  const [focusSubscriptionId, setFocusSubscriptionId] = useState<number | null>(
    null,
  )
  const [yearlyCost, setYearlyCost] = useState<number | undefined>()
  const [monthlyCost, setMonthlyCost] = useState<number | undefined>()
  const [loading, setLoading] = useState<boolean>(true)

  const [settings, setSettings] = useState<UserSettings>()

  useEffect(() => {
    setFocusSubscriptionId(null)
    const forceUpdate = true
    context
      .getSubscriptions(forceUpdate)
      .then(subs => setSubscriptions(subs))
      .catch(err => alert(`Failed to get subscriptions: ${err.message}`))

    context.getLabels().then(l => setLabels(l))
    context.getUserSettings().then(settings => setSettings(settings))
    setTimeout(() => setLoading(false), 1000)
  }, [])

  useEffect(() => {
    if (subscriptions) {
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      Promise.all(
        subscriptions
          .filter(sub => !sub.archieved)
          .map(sub => {
            console.log('Retrieving expenses for sub ', sub.id)
            return Api.getPlans(sub.id.toString())
          }),
      ).then(data => {
        const allPlans = data.flat()
        setYearlyCost(
          getTotalCost(startOfYear.getTime(), now.getTime(), allPlans),
        )
        setMonthlyCost(
          getTotalCost(startOfMonth.getTime(), now.getTime(), allPlans),
        )
      })
    }
  }, [subscriptions])

  if (!subscriptions) {
    return <div></div>
  }

  if (addSubscription) {
    return <Navigate to='/subscriptions/new/edit' />
  }

  if (focusSubscriptionId) {
    return <Navigate to={'/subscriptions/' + focusSubscriptionId} />
  }

  const billingFrequencyToMilliseconds = (
    billing_frequency?: BillingFrequency,
  ) => {
    if (billing_frequency === 'daily') {
      return 60 * 60 * 24 * 1000
    }

    if (billing_frequency === 'weekly') {
      return 60 * 60 * 24 * 7 * 1000
    }

    if (billing_frequency === 'monthly') {
      return 60 * 60 * 24 * 31 * 1000
    }

    if (billing_frequency === 'yearly') {
      return 60 * 60 * 24 * 365 * 1000
    }
    return 0
  }

  const getTotalCost = (
    start_time_unix_ms: number,
    end_time_unix_ms: number,
    plans: Plan[],
  ) => {
    // TODO(giuseppe) this is slightly hacky, not accounting for
    // leap years and february and different months, but in practice
    // just for an overview it will eventually be right most of the times

    // UNIX timestamp in milliseconds
    const totalCost = plans
      .map(plan => {
        const start = Math.max(
          start_time_unix_ms,
          new Date(plan.start_date).getTime(),
        )
        const end = plan.end_date
          ? Math.min(end_time_unix_ms, new Date(plan.end_date).getTime())
          : end_time_unix_ms
        const delta = billingFrequencyToMilliseconds(plan.billing_frequency)
        const cost = plan.cost ?? 0

        return { start, end, delta, cost }
      })
      .filter(info => info.delta > 0 && info.end > info.start)
      .map(info => {
        const periods = Math.ceil((info.end - info.start) / info.delta)
        return info.cost * periods
      })
      .reduce((acc, cost) => acc + cost, 0.0)
    return totalCost
  }

  return (
    <div>
      <div className='flex flex-row justify-evenly w-full mb-4'>
        <MetricCard
          header='This month'
          loadingDetails={
            monthlyCost === undefined || yearlyCost === undefined || loading
          }
          details={`${monthlyCost} ${settings?.budget_currency}`}
        />
        <MetricCard
          header='This year'
          loadingDetails={
            monthlyCost === undefined || yearlyCost === undefined || loading
          }
          details={`${yearlyCost} ${settings?.budget_currency}`}
        />
        <MetricCard
          header='Budget'
          loadingDetails={
            monthlyCost === undefined || yearlyCost === undefined || loading
          }
          details={`${settings?.budget} ${settings?.budget_currency}`}
        />
      </div>
      <FloatingActionButton onClick={() => setAddSubscription(true)} />
      <div className='pr-2 pl-2'>
        <p className='text-4xl'>Subscriptions</p>
        {subscriptions
          .sort((a, b) => {
            if (a.created_at < b.created_at) {
              return -1
            }
            if (a.created_at > b.created_at) {
              return 1
            }
            if (a.id < b.id) {
              return -1
            }
            if (a.id > b.id) {
              return 1
            }
            return 0
          })
          .map(sub => (
            <SubscriptionCardView
              subscription={sub}
              labels={labels.filter(l => l.subscription === sub.id)}
              key={sub.id}
              onClick={() => {
                setFocusSubscriptionId(sub.id)
              }}
            />
          ))}
      </div>
    </div>
  )
}

export default SubscriptionsPage
