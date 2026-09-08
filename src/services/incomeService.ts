import { supabase } from '../lib/supabaseClient'
import type { Income, IncomeInput } from '../types/income'

export async function fetchIncome(): Promise<Income[]> {
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createIncome(input: IncomeInput, userId: string): Promise<Income> {
  const { data, error } = await supabase
    .from('income')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateIncome(id: string, input: IncomeInput): Promise<Income> {
  const { data, error } = await supabase
    .from('income')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteIncome(id: string): Promise<void> {
  const { error } = await supabase.from('income').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
