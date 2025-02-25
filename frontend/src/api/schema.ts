import { z } from 'zod'

export const SubscriptionSchema = z.object({
  title: z.string(),
  amount: z.number(),
  amount_currenct: z.string(),
  created_at: z.date(),
  billed_at: z.date(),
  remind: z.boolean(),
  autorenewal: z.boolean(),
  expiring_at: z.date(),
  external_link: z.string(),
  archieved: z.boolean(),
  last_reminder_at: z.date().nullable(),
  total_reminders: z.number(),
  user_id: z.number(),
})
