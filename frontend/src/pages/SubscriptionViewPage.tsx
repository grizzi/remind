import { Api } from '../api/api'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import { Subscription, UserSettings, Currency, Plan } from '../api/schema'
import { useAppContext } from '../context'
import EditablePlanTable from '../components/views/EditableTablePlan'
import { FaEdit } from 'react-icons/fa'

const SubscriptionViewPage = () => {
  const context = useAppContext()
  const { subId } = useParams()
  const [subscription, setSubscription] = useState<Subscription>()
  const [plans, setPlans] = useState<Plan[]>([])
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const id = Number(subId)

    const forceUpdate = true
    context.getSubscriptions(forceUpdate).then(subs => {
      console.log(JSON.stringify(subs))
      setSubscription(subs.find(sub => sub.id === id))
      console.log('Subscription is now set!')
    })

    console.log('Sub Id is: ', subId)
    if (subId !== 'new') {
      console.log('Fetching plans!!!')
      Api.getPlans(subId!)
        .then(plans => setPlans(plans))
        .catch(error =>
          console.error(`Failed to get subscription plans: ${error.message}`),
        )
    }
  }, [subId])

  useEffect(() => {
    const fetchAndUpdate = async () => {
      context
        .getUserSettings()
        .then(settings => {
          setSettings(settings)
        })
        .catch(err => {
          console.error(err)
        })

      context
        .getCurrencies()
        .then(curr => {
          setCurrencies(curr)
        })
        .catch(err => {
          console.error(err)
        })
    }

    fetchAndUpdate()
  }, [])

  if (!settings || !currencies) {
    return <div></div>
  }

  return (
    <div>
      <div className='flex flex-row items-center mb-4'>
        <p className='text-3xl text-center'>{`${subscription?.title}`}</p>
        <div>
          <button
            className='m-2'
            onClick={() => navigate(`/subscriptions/${subscription?.id}/edit`)}
          >
            <FaEdit className="size-5"/>
          </button>
        </div>
      </div>
      <div className='flex flex-col w-full'>
        {subscription?.id && (
          <div>
            <EditablePlanTable
              subscription={subscription}
              plans={plans}
              settings={settings}
              currencies={currencies}
              onUpdate={async plan => {
                await Api.updatePlan(subscription!.id, plan)
              }}
              onDelete={plan => Api.deletePlan(subscription!.id, plan)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionViewPage
