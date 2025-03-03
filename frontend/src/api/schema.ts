import { z } from 'zod'

export const SubscriptionSchema = z.object({
  title: z.string(),
  amount: z.coerce.number(),
  amount_currency: z.string(),
  created_at: z.coerce.date(),
  billed_at: z.coerce.date(),
  remind: z.boolean(),
  autorenewal: z.boolean(),
  expiring_at: z.coerce.date(),
  external_link: z.string(),
  archieved: z.boolean(),
  last_reminder_at: z.coerce.date().nullable(),
  total_reminders: z.number(),
  user: z.number(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

export const UserSettingsSchema = z.object({
  user: z.number(),
  remind_within_days: z.number(),
  remind_frequency: z.string(),
  remind_at_most: z.number(),
  reminders_active: z.boolean(),
  budget: z.coerce.number(),
  budget_currency: z.string()
})

export type UserSettings = z.infer<typeof UserSettingsSchema>;
