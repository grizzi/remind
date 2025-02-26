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


export type Subscription = z.infer<typeof SubscriptionSchema>;
