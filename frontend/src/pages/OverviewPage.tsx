import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useAppContext } from '../context'

import { Label, Subscription, UserSettings } from '../api/schema'
import FloatingActionButton from '../components/buttons/FloatingActionButton'

import SubscriptionCard from '../components/shared/SubscriptionCard'
import { Api } from '../api/api'
import TagChip from '../components/shared/TagChip'
import { TbFilter, TbRefresh } from 'react-icons/tb'
import MetricCard from '../components/shared/MetricCard'
import { getTotalCost } from '../shared/TimeUtils'
import { toast } from 'react-toastify'

const SubscriptionsPage = () => {
  const context = useAppContext()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>()
  const [addSubscription, setAddSubscription] = useState<boolean>(false)
  const [labels, setLabels] = useState<Label[]>([])
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([])
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
      .then(subs => {
        setSubscriptions(subs)
        const now = new Date()
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        // Promise.all(
        //   subs
        //     .filter(sub => !sub.archieved)
        //     .map(sub => {
        //       return Api.getPlans(sub.id.toString())
        //     }),
        // ).then(data => {
        //   const allPlans = data.flat()
        //   setYearlyCost(
        //     getTotalCost(startOfYear.getTime(), now.getTime(), allPlans),
        //   )
        //   setMonthlyCost(
        //     getTotalCost(startOfMonth.getTime(), now.getTime(), allPlans),
        //   )
        // })
      })
      .catch(err =>
        console.error(`Failed to get subscriptions: ${err.message}`),
      )

    context.getLabels().then(l => setLabels(l))
    context.getUserSettings().then(settings => setSettings(settings))
    setTimeout(() => setLoading(false), 1000)
  }, [])


  if (!subscriptions) {
    return <div></div>
  }

  if (addSubscription) {
    return <Navigate to='/subscriptions/new/edit' />
  }

  if (focusSubscriptionId) {
    return <Navigate to={'/subscriptions/' + focusSubscriptionId} />
  }

  const toggleLabel = (name: string) => {
    const label = selectedLabels.find(l => l.name === name)
    if (label) {
      setSelectedLabels(selectedLabels.filter(l => l.name !== name))
    } else {
      setSelectedLabels([...selectedLabels, { name }])
    }
  }

  const getUniqueLabelNames = (labels: Label[]) => {
    const uniqueLabels = new Set<string>()
    labels.forEach(label => {
      if (!uniqueLabels.has(label.name)) {
        uniqueLabels.add(label.name)
      }
    })
    return Array.from(uniqueLabels)
  }

  const syncSubscriptions = () => {
    Api.doSync().then(() => {
      context.getSubscriptions(true).then(subs => {
        setSubscriptions(subs)
        toast.success('Subscriptions synced successfully!')
      })
    })
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row mb-4'>
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
      <div className='pr-2 pl-2 pb-36'>
        <div className='flex flex-row items-center justify-between mb-2'>
          <p className='text-3xl'>Subscriptions</p>
          <div className='p-2 text-gray-500 dark:text-white transition-transform duration-300 ease-in-out hover:text-gray-700 dark:hover:text-gray-300'>
            <button onClick={() => syncSubscriptions()}>
              <TbRefresh className='size-5' />
            </button>
          </div>
        </div>
        <div className='flex flex-wrap gap-0 items-center justify-end mt-2 mb-2'>
          {getUniqueLabelNames(labels).map(ln => (
            <div className='text-xs hover:cursor-pointer' key={ln}>
              <TagChip
                key={ln}
                onClick={() => toggleLabel(ln)}
                name={ln}
                disabled={!selectedLabels.some(sl => sl.name === ln)}
              />
            </div>
          ))}

          <div className='flex items-center gap-3'>
            <button
              onClick={() => {
                if (selectedLabels.length > 0) {
                  setSelectedLabels([])
                }
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150
      ${
        selectedLabels.length > 0
          ? 'text-purple-600 dark:text-pink-300 hover:bg-blue-100'
          : 'text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
            >
              <TbFilter className='text-lg' />
            </button>
          </div>
        </div>

        {subscriptions
          .filter(
            sub =>
              selectedLabels.length === 0 ||
              sub.labels?.some(l =>
                selectedLabels.find(ls => l.name === ls.name),
              ),
          )
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
            <SubscriptionCard
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
