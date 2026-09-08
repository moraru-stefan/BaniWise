import { supabase } from '../lib/supabaseClient'
import type { Category } from '../types/category'

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw new Error(error.message)
  return data
}
