export type RecurrenceFrequency = 'one_time' | 'weekly' | 'monthly' | 'yearly'

export interface Income {
  id: string
  user_id: string
  label: string
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
  created_at: string
}

export interface IncomeInput {
  label: string
  amount: number
  frequency: RecurrenceFrequency
  start_date: string
  end_date: string | null
}
