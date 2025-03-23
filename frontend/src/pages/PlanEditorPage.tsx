import { useEffect, useState } from 'react'
import PlanForm from '../components/forms/PlanForm'
import { useParams } from 'react-router'
import { Currency, Plan, UserSettings } from '../api/schema'
import { Api } from '../api/api'

const PlanEditor = () => {
  const { subId, planId } = useParams()
  const [currentPlan, setCurrentPlan] = useState<Plan>()
  const [settings, setSettings] = useState<UserSettings>()
  const [currencies, setCurrencies] = useState<Currency[]>([])

  useEffect(() => {
    if (subId === undefined) {
      alert(
        'Subscription id is undefined. Cannot edit plan for this subscription.',
      )
      return
    }

    if (planId === 'new') {
      setCurrentPlan(undefined)
    } else {
      Api.getPlans(subId, planId).then(p => setCurrentPlan(p[0]))
    }

    Api.getSupportedCurrencies()
      .then(curr => setCurrencies(curr))
      .catch(() => alert(`Failed to get supported currencies!`))

    Api.getUserSettings()
      .then(sett => setSettings(sett))
      .catch(() => alert('Failed to get user settings!'))
  }, [subId, planId])

  if (!currencies || !settings || !subId) {
    return <div></div>
  }

  return (
    <PlanForm
      currentPlan={currentPlan}
      currencies={currencies}
      settings={settings}
      onSave={() => {}}
      onDiscard={() => {}}
    />
  )
}

export default PlanEditor
