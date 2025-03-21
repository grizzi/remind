import { z } from 'zod'

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

export const UserSettingsSchema = z.object({
  remind_within_days: z.coerce.number(),
  remind_frequency: z.string(),
  remind_at_most: z.coerce.number(),
  reminders_active: z.boolean(),
  budget: z.coerce.number(),
  budget_currency: z.string(),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

// TODO: investigate the use of readonly variables
export const SubscriptionReadOnlySchema = z.object({
  id: z.number(),
  created_at: z.coerce.date(),
  last_reminder_at: z.coerce.date().nullable(),
  total_reminders: z.number(),
  user: z.number(),
  archieved: z.boolean(),
})

export const SubscriptionReadWriteSchema = z.object({
  title: z.string().nonempty('Title should not be empty!'),
  amount: z.coerce.number().gt(0, 'Insert a positive amount'),
  amount_currency: z.string(),
  date_start: z.coerce.date(),
  remind: z.boolean(),
  autorenewal: z.boolean(),
  expiring_at: z.coerce.date(),
  external_link: z.string(),
  labels: z.array(LabelSchema).optional().default([]),
})

export const SubscriptionSchema = SubscriptionReadOnlySchema.merge(
  SubscriptionReadWriteSchema,
)
export type SubscriptionReadWrite = z.infer<typeof SubscriptionReadWriteSchema>
export type SubscriptionReadOnly = z.infer<typeof SubscriptionReadOnlySchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
