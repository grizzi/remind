import { z } from 'zod'

export type User = {
  username: string
  email: string
}

export const CurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
})

export type Currency = z.infer<typeof CurrencySchema>

export const LabelSchema = z.object({
  subscription: z.number().optional(),
  name: z.string(),
})

export type Label = z.infer<typeof LabelSchema>

export const BillingFrequencySchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'yearly',
])

export type BillingFrequency = z.infer<typeof BillingFrequencySchema>

export const PlanSchema = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('Name should not be empty!'),
  subscription: z.number().optional(),
  auto_renew: z.boolean(),
  start_date: z.string().date(),
  end_date: z.string().date().nullable(),
  cost: z.coerce.number().gte(0, 'Insert a non negative amount'),
  cost_currency: z.string(),
  billing_frequency: BillingFrequencySchema.optional(),
})

export type Plan = z.infer<typeof PlanSchema>

export const RemindFrequencySchema = z.enum(['monthly', 'weekly'])

export const UserSettingsSchema = z.object({
  remind_within_days: z.coerce.number().gt(-1, 'Remind days should be 0 or '),
  remind_frequency: RemindFrequencySchema,
  remind_at_most: z.coerce.number(),
  reminders_active: z.boolean(),
  monthly_report_active: z.boolean(),
  budget: z.coerce.number(),
  budget_currency: z.string(),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

export const SubscriptionReadOnlySchema = z.object({
  id: z.number(),
  created_at: z.coerce.date(),
  user: z.number(),
  archieved: z.boolean(),
})

export const SubscriptionReadWriteSchema = z.object({
  title: z.string().nonempty('Title should not be empty!'),
  remind: z.boolean(),
  external_link: z.string(),
  labels: z.array(LabelSchema).optional().default([]),
})

export const SubscriptionSchema = SubscriptionReadOnlySchema.merge(
  SubscriptionReadWriteSchema,
)
export type SubscriptionReadWrite = z.infer<typeof SubscriptionReadWriteSchema>
export type SubscriptionReadOnly = z.infer<typeof SubscriptionReadOnlySchema>
export type Subscription = z.infer<typeof SubscriptionSchema>

export const CurrenciesListSchema = z.array(CurrencySchema)
export const SubscriptionsListSchema = z.array(SubscriptionSchema)
export const LabelsListSchema = z.array(LabelSchema)
export const PlansListSchema = z.array(PlanSchema)
