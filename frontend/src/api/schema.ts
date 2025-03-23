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

export const PlanSchema = z
  .object({
    subscription: z.number().optional(),
    auto_renew: z.boolean(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    cost: z.coerce.number().gt(0, 'Insert a positive amount').optional(),
    cost_currency: z.string().optional(),
    billing_frequency: z
      .enum(['daily', 'weekly', 'monthly', 'yearly'])
      .optional(),
  })
  .refine(
    data => {
      return (
        (!data?.cost && data?.cost_currency) ||
        (data?.cost && !data?.cost_currency)
      )
    },
    {
      message: 'Both currency and plan cost must be specified!',
    },
  )

export type Plan = z.infer<typeof PlanSchema>

export const UserSettingsSchema = z.object({
  remind_within_days: z.coerce.number(),
  remind_frequency: z.string(),
  remind_at_most: z.coerce.number(),
  reminders_active: z.boolean(),
  budget: z.coerce.number(),
  budget_currency: z.string(),
})

export type UserSettings = z.infer<typeof UserSettingsSchema>

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
  remind: z.boolean(),
  external_link: z.string(),
  labels: z.array(LabelSchema).optional().default([]),
  plans: z.array(PlanSchema).optional().default([]),
})

export const SubscriptionSchema = SubscriptionReadOnlySchema.merge(
  SubscriptionReadWriteSchema,
)
export type SubscriptionReadWrite = z.infer<typeof SubscriptionReadWriteSchema>
export type SubscriptionReadOnly = z.infer<typeof SubscriptionReadOnlySchema>
export type Subscription = z.infer<typeof SubscriptionSchema>
