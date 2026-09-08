import { useCallback, useEffect, useState } from 'react'
import { createIncome, deleteIncome, fetchIncome, updateIncome } from '../services/incomeService'
import type { Income, IncomeInput } from '../types/income'
import { useAuth } from './useAuth'

export function useIncome() {
  const { user } = useAuth()
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadIncomes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchIncome()
      setIncomes(data)
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
    loadIncomes()
  }, [loadIncomes])

  async function addIncome(input: IncomeInput) {
    if (!user) return
    await createIncome(input, user.id)
    await loadIncomes()
  }

  async function editIncome(id: string, input: IncomeInput) {
    await updateIncome(id, input)
    await loadIncomes()
  }

  async function removeIncome(id: string) {
    await deleteIncome(id)
    await loadIncomes()
  }

  return { incomes, loading, error, addIncome, editIncome, removeIncome }
}
