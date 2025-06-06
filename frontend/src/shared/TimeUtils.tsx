import { Plan, BillingFrequency } from '../api/schema'

export const ParseDate = function parseDate(dateStr: string | null): number {
  if (!dateStr) return Infinity
  const time = new Date(dateStr).getTime()
  return isNaN(time) ? Infinity : time
}

export const billingFrequencyToMilliseconds = (
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

/**
 * Compute the total incurred cost of a list of planst
 * between a start and end time
 * @param start_time_unix_ms start time in unix milliseconds
 * @param end_time_unix_ms end time in unix milliseconds
 * @param plans list of plans
 * @returns the toal cost incurred
 */
export const getTotalCost = (
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

export const planExpiredFromDate = (plan: Plan): boolean => {
  if (!plan.start_date || !plan.end_date) return false
  return new Date() > new Date(plan.end_date)
}
