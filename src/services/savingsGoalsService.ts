import { supabase } from '../lib/supabaseClient'
import type { SavingsGoal, SavingsGoalInput } from '../types/savingsGoal'

export async function fetchSavingsGoals(): Promise<SavingsGoal[]> {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createSavingsGoal(input: SavingsGoalInput, userId: string): Promise<SavingsGoal> {
  const { data, error } = await supabase
    .from('savings_goals')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateSavingsGoal(id: string, input: SavingsGoalInput): Promise<SavingsGoal> {
  const { data, error } = await supabase
    .from('savings_goals')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  const { error } = await supabase.from('savings_goals').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
