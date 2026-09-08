import { useCallback, useEffect, useState } from 'react'
import { createExpense, deleteExpense, fetchExpenses, updateExpense } from '../services/expenseService'
import type { Expense, ExpenseInput } from '../types/expense'
import { useAuth } from './useAuth'

export function useExpenses() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchExpenses()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetching on mount is the intended use of this effect (synchronizing
    // with the Supabase "external system"), so the resulting setState is expected.
    // oxlint-disable-next-line react/set-state-in-effect
    loadExpenses()
  }, [loadExpenses])

  async function addExpense(input: ExpenseInput) {
    if (!user) return
    await createExpense(input, user.id)
    await loadExpenses()
  }

  async function editExpense(id: string, input: ExpenseInput) {
    await updateExpense(id, input)
    await loadExpenses()
  }

  async function removeExpense(id: string) {
    await deleteExpense(id)
    await loadExpenses()
  }

  return { expenses, loading, error, addExpense, editExpense, removeExpense }
}
