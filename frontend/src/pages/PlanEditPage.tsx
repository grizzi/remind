import { useEffect, useState } from 'react'
import { Plan, Subscription, UserSettings } from '../api/schema'
import { toast } from 'react-toastify'
import { Api } from '../api/api'
import { useNavigate, useParams } from 'react-router'
import { useAppContext } from '../context'

import PlanForm from '../components/forms/PlanForm'

const PlanEditPage = () => {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [_, setSettings] = useState<UserSettings | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const { subId, planId } = useParams()

  const navigate = useNavigate()
  const { getUserSettings, getSubscriptions } = useAppContext()

  useEffect(() => {
    const loadData = async () => {
      try {
        const subscriptions = await getSubscriptions(false)
        const sub = subscriptions.find(sub => sub.id === Number(subId))
        if (!sub) {
          console.error('No subscriptions found')
          navigate('/')
        } else {
          setSubscription(sub)
        }

        const userSettings = await getUserSettings()
        if (!userSettings) {
          console.error('User settings not found')
          navigate('/')
          return
        }
        setSettings(userSettings)

        if (planId === 'new') {
          setPlan({
            subscription: Number(subId),
            name: '',
            auto_renew: false,
            start_date: formatDate(new Date()),
            end_date: formatDate(new Date()),
            cost: 0,
            cost_currency: userSettings.budget_currency,
            billing_frequency: 'monthly',
          })
        } else {
          const fetchedPlan = await Api.getPlan(subId!, planId!)
          setPlan(fetchedPlan)
        }
      } catch (err: any) {
        console.error(`Failed to initialize plan editor: ${err.message}`)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const onSubmit = (plan: Plan) => {
    Api.updatePlan(plan.subscription!, plan)
      .then(() => {
        toast.success('Plan updated successfully')
        navigate(`/subscriptions/${plan.subscription}`)
      })
      .catch(err => toast.error(`Could not update plan: ${err.message}`))
  }

  if (loading || !plan) {
    return <div></div>
  }

  return (
    <div>
      <p className='mb-4 text-3xl'>{subscription!.title} - Edit Plan </p>
      <PlanForm plan={plan!} onSubmit={onSubmit} />
    </div>
  )
}

export default PlanEditPage
