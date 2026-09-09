export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  monthly_contribution: number
  created_at: string
}

export interface SavingsGoalInput {
  name: string
  target_amount: number
  current_amount: number
  monthly_contribution: number
}
