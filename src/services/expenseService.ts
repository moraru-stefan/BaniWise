import { supabase } from '../lib/supabaseClient'
import type { Expense, ExpenseInput } from '../types/expense'

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createExpense(input: ExpenseInput, userId: string): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...input, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
