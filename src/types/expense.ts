import type { RecurrenceFrequency } from './recurrence'

export interface Expense {
  id: string
  user_id: string
  category_id: string
  label: string
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
  notes: string | null
  created_at: string
}

export interface ExpenseInput {
  category_id: string
  label: string
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
  notes: string | null
}
