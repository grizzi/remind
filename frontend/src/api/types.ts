// Check this tutorial to use zod with axios for scheme validation
// https://medium.com/@roman_j/mastering-zod-validation-in-react-a-comprehensive-guide-7c1b046547ac

export interface Subscription {
  title: string
  amount: number
  amount_currenct: string
  created_at: Date
  billed_at: Date
  remind: boolean
  autorenewal: boolean
  expiring_at: Date
  external_link: string | null
  archieved: boolean
  last_reminder_at: Date | null
  total_reminders: number
  user_id: number
}

export interface Note {
  author: string
  title: string
  content: string
  created_at: string
  id: number
}

export interface User {
  user: string
}
